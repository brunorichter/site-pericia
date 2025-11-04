import type { NextApiRequest, NextApiResponse } from 'next';
import { mapPericiaRowToJudicialProcess, PericiaRow, JudicialProcess, JusticeType, PericiaType } from '../../types';
import { applyCors } from '../../lib/cors';

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
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy}`;
}

function latestFeeChargedAmount(jp: JudicialProcess): number | null {
  if (!jp.feesCharged || jp.feesCharged.length === 0) return null;
  const sorted = [...jp.feesCharged].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return sorted[0]?.amount ?? null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (applyCors(req, res)) return;

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, DB_CHARSET } = process.env;

  // If DB is not configured, return 204 to let client fallback to mock.
  if (!DB_HOST || !DB_USER || !DB_DATABASE) {
    return res.status(204).end();
  }

  try {
    // dynamic require so the app can run even without mysql2 installed
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
      const [rows] = await conn.execute('SELECT * FROM pericia ORDER BY id DESC LIMIT 200');
      await conn.end();
      const data = (rows as PericiaRow[]).map(mapPericiaRowToJudicialProcess);
      return res.status(200).json({ ok: true, data });
    }

    // POST - insert new process
    const body = req.body as Partial<JudicialProcess>;
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
    const valorCobrado = latestFeeChargedAmount(body as JudicialProcess) ?? 0;
    const statusText = String(body.status || '').trim();

    const sql = `INSERT INTO pericia (processo, autor, reu, cidade, vara, status, descricao, valor_causa, fl_ajg, fl_tipo, valor_cobrado, dataInicio)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [processNumber, plaintiff, defendant, city, 0, statusText, description, caseValue, justiceBit, periciaBit, valorCobrado, startDate];
    const [result] = await conn.execute(sql, params);
    // @ts-ignore insertId available in mysql2 result
    const newId = result?.insertId;
    const [rows] = await conn.execute('SELECT * FROM pericia WHERE id = ? LIMIT 1', [newId]);
    await conn.end();
    const row = (rows as PericiaRow[])[0];
    const data = row ? mapPericiaRowToJudicialProcess(row) : undefined;
    return res.status(200).json({ ok: true, data });
  } catch (err: any) {
    // If mysql2 is missing or connection fails, signal no content for client fallback
    return res.status(204).end();
  }
}
