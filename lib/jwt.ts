// Minimal JWT HS256 utilities without external dependencies
// Note: For production-grade needs, prefer a vetted library.

import crypto from 'crypto';

function base64url(input: Buffer | string): string {
  const raw = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return raw
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function signJwt(
  payload: Record<string, any>,
  secret: string,
  expiresInSeconds: number
): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInSeconds;

  const fullPayload = { ...payload, iat, exp };

  const headerB64 = base64url(JSON.stringify(header));
  const payloadB64 = base64url(JSON.stringify(fullPayload));
  const data = `${headerB64}.${payloadB64}`;

  const signature = require('crypto')
    .createHmac('sha256', secret)
    .update(data)
    .digest();
  const sigB64 = base64url(signature);

  return `${data}.${sigB64}`;
}

export function verifyJwt(token: string, secret: string): { valid: boolean; payload?: any; reason?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false, reason: 'malformed' };
    const [headerB64, payloadB64, sigB64] = parts;
    const data = `${headerB64}.${payloadB64}`;

    const expected = base64url(require('crypto').createHmac('sha256', secret).update(data).digest());
    if (expected !== sigB64) return { valid: false, reason: 'signature' };

    const payloadJson = Buffer.from(payloadB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    const payload = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === 'number' && now > payload.exp) {
      return { valid: false, reason: 'expired' };
    }
    return { valid: true, payload };
  } catch (e) {
    return { valid: false, reason: 'error' };
  }
}

