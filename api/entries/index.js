import { connectDB } from '../../utils/db.js';
import DiaryEntry from '../../models/DiaryEntry.js';
import { entrySchema, validate } from '../../utils/validators.js';
import { requireAuth } from '../../middleware/auth.js';
import { handleError, handleOptions, parseJsonBody, sendJson } from '../../utils/http.js';

function serializeEntry(entry) {
  return {
    id: entry._id,
    date: entry.date,
    title: entry.title,
    content: entry.content,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt
  };
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  try {
    await connectDB();
    requireAuth(req);

    if (req.method === 'GET') {
      const entries = await DiaryEntry.find({ userId: req.userId }).sort({
        date: -1,
        createdAt: -1
      });

      return sendJson(res, 200, {
        success: true,
        entries: entries.map(serializeEntry)
      });
    }

    if (req.method === 'POST') {
      const body = await parseJsonBody(req);
      const payload = await validate(entrySchema, body);

      const entry = await DiaryEntry.create({
        ...payload,
        userId: req.userId
      });

      return sendJson(res, 201, {
        success: true,
        entry: serializeEntry(entry)
      });
    }

    return sendJson(res, 405, { success: false, message: 'Method Not Allowed' });
  } catch (error) {
    handleError(res, error);
  }
}

