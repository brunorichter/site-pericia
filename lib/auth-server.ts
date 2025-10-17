import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { verifyJwt } from './jwt';

function parseCookies(cookieHeader?: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = decodeURIComponent(part.slice(idx + 1).trim());
    out[key] = val;
  }
  return out;
}

export function isRequestAuthenticated(ctx: GetServerSidePropsContext): boolean {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) return false;
  const cookies = parseCookies(ctx.req.headers?.cookie || '');
  const token = cookies['session'];
  if (!token) return false;
  const { valid } = verifyJwt(token, JWT_SECRET);
  return !!valid;
}

export function redirectToLogin<T = any>(ctx: GetServerSidePropsContext): GetServerSidePropsResult<T> {
  const returnTo = encodeURIComponent(ctx.resolvedUrl || '/');
  return {
    redirect: {
      destination: `/login?returnTo=${returnTo}`,
      permanent: false,
    },
  };
}

