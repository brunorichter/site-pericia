import type { NextApiRequest, NextApiResponse } from 'next';
import { mapHonorarioRowToFeeProposal, HonorarioRow } from '../../../../../types';

function toDateTime(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, feeId } = req.query;

  if (!id || Array.isArray(id) || !feeId || Array.isArray(feeId)) {
    return res.status(400).json({ ok: false, error: 'Invalid identifiers' });
  }

  if (!['PUT', 'DELETE'].includes(req.method || '')) {
    res.setHeader('Allow', ['PUT', 'DELETE']);
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

    if (req.method === 'PUT') {
      const { amount, date, source } = req.body ?? {};
      if (!source || typeof source !== 'string') {
        await conn.end();
        return res.status(400).json({ ok: false, error: 'Invalid source' });
      }
      const amountValue = Number(amount ?? 0) || 0;
      const dateValue = toDateTime(date || new Date().toISOString());

      const updateSql = 'UPDATE honorarios SET `desc` = ?, valor = ?, data = ? WHERE id = ? AND proc_id = ?';
      const [result] = await conn.execute(updateSql, [source.trim(), amountValue, dateValue, feeId, id]);
      // @ts-ignore mysql2 result shape
      if (!result || result.affectedRows === 0) {
        await conn.end();
        return res.status(404).json({ ok: false, error: 'Proposal not found' });
      }

      const [rows] = await conn.execute(
        'SELECT id, proc_id, `desc`, valor, data, dtins FROM honorarios WHERE id = ? LIMIT 1',
        [feeId],
      );
      await conn.end();
      const row = (rows as HonorarioRow[])[0];
      return res.status(200).json({ ok: true, data: row ? mapHonorarioRowToFeeProposal(row) : null });
    }

    const [result] = await conn.execute('DELETE FROM honorarios WHERE id = ? AND proc_id = ?', [feeId, id]);
    await conn.end();
    // @ts-ignore mysql2 result shape
    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ ok: false, error: 'Proposal not found' });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(204).end();
  }
}
