import type { NextApiRequest, NextApiResponse } from 'next';

const DEFAULT_ALLOWED_HEADERS = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
const DEFAULT_ALLOWED_METHODS = 'GET,POST,PUT,PATCH,DELETE,OPTIONS';

const getAllowedOrigin = (req: NextApiRequest): string => {
  const envOrigin = process.env.CORS_ORIGIN?.trim();
  if (envOrigin) return envOrigin;

  const requestOrigin = Array.isArray(req.headers.origin) ? req.headers.origin[0] : req.headers.origin;
  if (requestOrigin) return requestOrigin;

  const host = Array.isArray(req.headers.host) ? req.headers.host[0] : req.headers.host;
  const protocolHeader = Array.isArray(req.headers['x-forwarded-proto'])
    ? req.headers['x-forwarded-proto'][0]
    : req.headers['x-forwarded-proto'];
  const protocol = protocolHeader || (process.env.NODE_ENV === 'production' ? 'https' : 'http');
  return host ? `${protocol}://${host}` : '*';
};

export const applyCors = (req: NextApiRequest, res: NextApiResponse): boolean => {
  const allowedOrigin = getAllowedOrigin(req);
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Vary', 'Origin');

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', process.env.CORS_ALLOWED_HEADERS || DEFAULT_ALLOWED_HEADERS);
  res.setHeader('Access-Control-Allow-Methods', process.env.CORS_ALLOWED_METHODS || DEFAULT_ALLOWED_METHODS);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
};
