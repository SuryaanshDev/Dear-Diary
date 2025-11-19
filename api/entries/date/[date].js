import { connectDB } from '../../../utils/db.js';
import DiaryEntry from '../../../models/DiaryEntry.js';
import { requireAuth } from '../../../middleware/auth.js';
import { handleError, handleOptions, sendJson } from '../../../utils/http.js';

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

  if (req.method !== 'GET') {
    return sendJson(res, 405, { success: false, message: 'Method Not Allowed' });
  }

  try {
    await connectDB();
    requireAuth(req);

    const {
      query: { date }
    } = req;

    if (!date) {
      const error = new Error('Date parameter is required');
      error.statusCode = 400;
      throw error;
    }

    const decodedDate = decodeURIComponent(date);

    const entries = await DiaryEntry.find({
      userId: req.userId,
      date: decodedDate
    }).sort({ createdAt: -1 });

    return sendJson(res, 200, { success: true, entries: entries.map(serializeEntry) });
  } catch (error) {
    handleError(res, error);
  }
}

