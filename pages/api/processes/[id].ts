import type { NextApiRequest, NextApiResponse } from 'next';
import { mapPericiaRowToJudicialProcess, PericiaRow, JudicialProcess, JusticeType, PericiaType } from '../../../types';

function toDateTime(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} 00:00:00`;
}

function ultimoPagamento(jp: JudicialProcess): number | null {
  if (!jp.feesCharged || jp.feesCharged.length === 0) return null;
  const sorted = [...jp.feesCharged].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return sorted[0]?.amount ?? null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });

  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, DB_CHARSET } = process.env;
  if (!DB_HOST || !DB_USER || !DB_DATABASE) {
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
      await conn.end();
      const row = (rows as PericiaRow[])[0];
      if (!row) return res.status(404).json({ ok: false, error: 'Not found' });
      return res.status(200).json({ ok: true, data: mapPericiaRowToJudicialProcess(row) });
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
      const startDate = toDateTime(body.startDate || '');
      const valorCobrado = ultimoPagamento(body as JudicialProcess) ?? 0;
      const sql = `UPDATE pericia
        SET processo = ?, autor = ?, reu = ?, cidade = ?, descricao = ?, valorCausa = ?, fl_ajg = ?, fl_tipo = ?, valorCobrado = ?, dataInicio = ?, status = ?
        WHERE id = ?`;
      const params = [processNumber, plaintiff, defendant, city, description, caseValue, justiceBit, periciaBit, valorCobrado, startDate, (body.status || ''), id];
      await conn.execute(sql, params);
      await conn.end();
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    await conn.end();
    return res.status(405).end('Method Not Allowed');
  } catch (e: any) {
    // Return 204 so client falls back if needed
    return res.status(204).end();
  }
}
