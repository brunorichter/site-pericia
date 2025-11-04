import type { NextApiRequest, NextApiResponse } from 'next';
import {
  mapPericiaRowToJudicialProcess,
  PericiaRow,
  JudicialProcess,
  JusticeType,
  PericiaType,
  mapPaymentRowToPayment,
  PaymentRow,
  mapHonorarioRowToFeeProposal,
  HonorarioRow,
} from '../../../types';

function formatDateForDb(value: string): string | null {
  if (!value) return null;
  const normalized = String(value).trim();

  const isoDate = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDate) {
    return `${isoDate[3]}-${isoDate[2]}-${isoDate[1]}`;
  }

  const brDate = normalized.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (brDate) {
    return `${brDate[1]}-${brDate[2]}-${brDate[3]}`;
  }

  const d = new Date(normalized);
  if (isNaN(d.getTime())) return null;
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate());
  return `${dd.padStart(2, '0')}-${mm}-${yyyy}`;
}

function ultimoPagamento(jp: JudicialProcess): number | null {
  if (!jp.feesCharged || jp.feesCharged.length === 0) return null;
  const sorted = [...jp.feesCharged].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return sorted[0]?.amount ?? null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });

  console.log('[api/processes/[id]] incoming request', {
    method: req.method,
    id,
    url: req.url,
  });

  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, DB_CHARSET } = process.env;
  if (!DB_HOST || !DB_USER || !DB_DATABASE) {
    console.log('[api/processes/[id]] missing DB configuration, returning 204', {
      hasHost: Boolean(DB_HOST),
      hasUser: Boolean(DB_USER),
      hasDatabase: Boolean(DB_DATABASE),
    });
    return res.status(204).end();
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mysql = require('mysql2/promise');
    const conn = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT ? Number(DB_PORT) : 3306,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      charset: DB_CHARSET || 'latin1',
    });

    if (req.method === 'GET') {
      const [rows] = await conn.execute('SELECT * FROM pericia WHERE id = ? LIMIT 1', [id]);
      const row = (rows as PericiaRow[])[0];
      if (!row) {
        await conn.end();
        console.log('[api/processes/[id]] id not found in database', { id });
        return res.status(404).json({ ok: false, error: 'Not found' });
      }

      const [honorariosRows] = await conn.execute(
        'SELECT id, proc_id, `desc`, valor, data, dtins FROM honorarios WHERE proc_id = ? ORDER BY data DESC, id DESC',
        [id],
      );

      const [paymentsRows] = await conn.execute(
        'SELECT id, proc_id, `desc`, valor_depositado, imposto_retido, valor_total, data FROM pagamentos WHERE proc_id = ? ORDER BY data DESC, id DESC',
        [id],
      );

      await conn.end();

      const process = mapPericiaRowToJudicialProcess(row);
      if (Array.isArray(honorariosRows)) {
        process.feesCharged = (honorariosRows as HonorarioRow[]).map(mapHonorarioRowToFeeProposal);
      }
      if (Array.isArray(paymentsRows)) {
        process.feesReceived = (paymentsRows as PaymentRow[]).map(mapPaymentRowToPayment);
      }

      return res.status(200).json({ ok: true, data: process });
    }

    if (req.method === 'PUT') {
      const body = req.body as Partial<JudicialProcess>;
      if (!body) {
        await conn.end();
        return res.status(400).json({ ok: false, error: 'Missing body' });
      }

      const processNumber = body.processNumber ?? '';
      const plaintiff = body.plaintiff ?? '';
      const defendant = body.defendant ?? '';
      const city = body.city ?? '';
      const description = body.description ?? '';
      const caseValue = typeof body.caseValue === 'number' ? body.caseValue : Number(body.caseValue || 0) || 0;
      const justiceBit = (body.justiceType === JusticeType.AJG) ? 1 : 0;
      const periciaBit = (body.periciaType === PericiaType.LOCAL) ? 1 : 0;
      const startDate = formatDateForDb(body.startDate || '');
      if (!startDate) {
        await conn.end();
        return res.status(400).json({ ok: false, error: 'Data de início inválida' });
      }
      const valorCobrado = ultimoPagamento(body as JudicialProcess) ?? 0;
      const sql = `UPDATE pericia
        SET processo = ?, autor = ?, reu = ?, cidade = ?, descricao = ?, valor_causa = ?, fl_ajg = ?, fl_tipo = ?, valor_cobrado = ?, dataInicio = ?, status = ?
        WHERE id = ?`;
      const params = [processNumber, plaintiff, defendant, city, description, caseValue, justiceBit, periciaBit, valorCobrado, startDate, (body.status || ''), id];
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mysqlLib = require('mysql2');
        console.log('[api/processes/[id]] Executing SQL:', mysqlLib.format(sql, params));
      } catch {
        console.log('[api/processes/[id]] Executing SQL with params:', sql, params);
      }
      const [result] = await conn.execute(sql, params);
      

      // @ts-ignore mysql2 result typing
      const affected = result?.affectedRows ?? 0;
      if (!affected) {
        await conn.end();
        return res.status(404).json({ ok: false, error: 'Processo não encontrado para atualização' });
      }

      const [rows] = await conn.execute('SELECT * FROM pericia WHERE id = ? LIMIT 1', [id]);
      if (!Array.isArray(rows) || !rows.length) {
        await conn.end();
        return res.status(404).json({ ok: false, error: 'Processo não encontrado após atualização' });
      }

      const [honorariosRows] = await conn.execute(
        'SELECT id, proc_id, `desc`, valor, data, dtins FROM honorarios WHERE proc_id = ? ORDER BY data DESC, id DESC',
        [id],
      );

      const [paymentsRows] = await conn.execute(
        'SELECT id, proc_id, `desc`, valor_depositado, imposto_retido, valor_total, data FROM pagamentos WHERE proc_id = ? ORDER BY data DESC, id DESC',
        [id],
      );

      await conn.end();

      const row = (rows as PericiaRow[])[0];
      const process = mapPericiaRowToJudicialProcess(row);

      if (Array.isArray(honorariosRows)) {
        process.feesCharged = (honorariosRows as HonorarioRow[]).map(mapHonorarioRowToFeeProposal);
      }
      if (Array.isArray(paymentsRows)) {
        process.feesReceived = (paymentsRows as PaymentRow[]).map(mapPaymentRowToPayment);
      }

      return res.status(200).json({ ok: true, data: process });
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    await conn.end();
    return res.status(405).end('Method Not Allowed');
  } catch (e: any) {
    console.error('[api/processes/[id]] unexpected error', {
      message: e?.message,
      stack: e?.stack,
    });
    // Return 204 so client falls back if needed
    return res.status(204).end();
  }
}
