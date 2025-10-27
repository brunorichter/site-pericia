import type { NextApiRequest, NextApiResponse } from 'next';
import { applyCors } from '../../lib/cors';

function serializeCookie(
  name: string,
  value: string,
  options: { path?: string; sameSite?: 'Lax' | 'Strict' | 'None'; secure?: boolean; httpOnly?: boolean; maxAge?: number } = {}
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
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }
  const forwardedProto = Array.isArray(req.headers['x-forwarded-proto'])
    ? req.headers['x-forwarded-proto'][0]
    : req.headers['x-forwarded-proto'];
  const cookieSecureEnv = process.env.COOKIE_SECURE?.toLowerCase();
  let useSecure: boolean;
  if (cookieSecureEnv === 'true') {
    useSecure = true;
  } else if (cookieSecureEnv === 'false') {
    useSecure = false;
  } else if (forwardedProto) {
    useSecure = forwardedProto === 'https';
  } else {
    useSecure = process.env.NODE_ENV === 'production';
  }
  const cookie = serializeCookie('session', '', {
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    secure: useSecure,
    maxAge: 0,
  });
  res.setHeader('Set-Cookie', cookie);
  return res.status(200).json({ ok: true });
}

