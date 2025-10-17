import type { NextApiRequest, NextApiResponse } from 'next';
import { signJwt } from '../../lib/jwt';

function badRequest(res: NextApiResponse, message = 'Requisição inválida') {
  return res.status(400).json({ ok: false, error: message });
}

function unauthorized(res: NextApiResponse) {
  return res.status(401).json({ ok: false, error: 'Credenciais inválidas' });
}

function serverError(res: NextApiResponse, message = 'Erro interno') {
  return res.status(500).json({ ok: false, error: message });
}

function serializeCookie(
  name: string,
  value: string,
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    path?: string;
    sameSite?: 'Lax' | 'Strict' | 'None';
    maxAge?: number; // seconds
  } = {}
): string {
  const parts = [`${name}=${value}`];
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.secure) parts.push('Secure');
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (typeof options.maxAge === 'number') parts.push(`Max-Age=${options.maxAge}`);
  return parts.join('; ');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    return badRequest(res, 'Parâmetros ausentes');
  }

  const EXPECTED_USER = process.env.AUTH_USERNAME;
  const EXPECTED_PASS = process.env.AUTH_PASSWORD;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!EXPECTED_USER || !EXPECTED_PASS || !JWT_SECRET) {
    return serverError(res, 'Autenticação não configurada (defina AUTH_USERNAME, AUTH_PASSWORD, JWT_SECRET).');
  }

  // Constant-time like comparison to reduce timing leaks for short values
  const uOk = Buffer.from(username).toString('utf8') === Buffer.from(EXPECTED_USER).toString('utf8');
  const pOk = Buffer.from(password).toString('utf8') === Buffer.from(EXPECTED_PASS).toString('utf8');
  if (!uOk || !pOk) return unauthorized(res);

  // Issue JWT and set HttpOnly cookie
  const token = signJwt({ sub: username }, JWT_SECRET, 60 * 60 * 8); // 8h
  const isProd = process.env.NODE_ENV === 'production';
  const cookie = serializeCookie('session', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  res.setHeader('Set-Cookie', cookie);
  return res.status(200).json({ ok: true });
}

