import type { NextApiRequest, NextApiResponse } from 'next';
import { mapHonorarioRowToFeeProposal, HonorarioRow } from '../../../../types';
import { applyCors } from '../../../../lib/cors';

function toDateTime(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (applyCors(req, res)) return;

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ ok: false, error: 'Invalid process id' });
  }

  if (!['GET', 'POST'].includes(req.method || '')) {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end('Method Not Allowed');
  }

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
      const [rows] = await conn.execute(
        'SELECT id, proc_id, `desc`, valor, data, dtins FROM honorarios WHERE proc_id = ? ORDER BY data DESC, id DESC',
        [id],
      );
      await conn.end();
      const data = (rows as HonorarioRow[]).map(mapHonorarioRowToFeeProposal);
      return res.status(200).json({ ok: true, data });
    }

    const { amount, date, source } = req.body ?? {};
    if (!source || typeof source !== 'string') {
      await conn.end();
      return res.status(400).json({ ok: false, error: 'Invalid source' });
    }
    const amountValue = Number(amount ?? 0) || 0;
    const dateValue = toDateTime(date || new Date().toISOString());

    const insertSql = 'INSERT INTO honorarios (proc_id, `desc`, valor, data, dtins) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)';
    const [result] = await conn.execute(insertSql, [id, source.trim(), amountValue, dateValue]);
    // @ts-ignore mysql2 insert result
    const newId = result?.insertId;

    const [rows] = await conn.execute(
      'SELECT id, proc_id, `desc`, valor, data, dtins FROM honorarios WHERE id = ? LIMIT 1',
      [newId],
    );
    await conn.end();
    const row = (rows as HonorarioRow[])[0];
    return res.status(201).json({ ok: true, data: row ? mapHonorarioRowToFeeProposal(row) : null });
  } catch (error) {
    return res.status(204).end();
  }
}
