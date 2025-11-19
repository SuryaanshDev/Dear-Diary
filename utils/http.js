export function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

export function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    setCors(res);
    res.statusCode = 200;
    res.end();
    return true;
  }
  return false;
}

export function sendJson(res, statusCode, payload) {
  setCors(res);
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = statusCode;
  res.end(JSON.stringify(payload));
}

export async function parseJsonBody(req) {
  if (req.body) {
    return req.body;
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString();

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    const err = new Error('Invalid JSON payload');
    err.statusCode = 400;
    throw err;
  }
}

export function handleError(res, error) {
  const status = error.statusCode || 500;
  const message =
    status === 500 ? 'Something went wrong. Please try again later.' : error.message;
  console.error('[API ERROR]', error);
  sendJson(res, status, { success: false, message });
}

