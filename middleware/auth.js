import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Authentication will fail until it is provided.');
}

export function requireAuth(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    const error = new Error('Authentication token missing');
    error.statusCode = 401;
    throw error;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    return payload;
  } catch {
    const authError = new Error('Invalid or expired token');
    authError.statusCode = 401;
    throw authError;
  }
}

