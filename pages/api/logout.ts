import type { NextApiRequest, NextApiResponse } from 'next';

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
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }
  const isProd = process.env.NODE_ENV === 'production';
  const cookie = serializeCookie('session', '', {
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    secure: isProd,
    maxAge: 0,
  });
  res.setHeader('Set-Cookie', cookie);
  return res.status(200).json({ ok: true });
}

