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

    const {
      query: { id }
    } = req;

    if (!id) {
      const error = new Error('Entry id is required');
      error.statusCode = 400;
      throw error;
    }

    if (req.method === 'GET') {
      const entry = await DiaryEntry.findOne({ _id: id, userId: req.userId });
      if (!entry) {
        const error = new Error('Entry not found');
        error.statusCode = 404;
        throw error;
      }
      return sendJson(res, 200, { success: true, entry: serializeEntry(entry) });
    }

    if (req.method === 'PUT') {
      const body = await parseJsonBody(req);
      const payload = await validate(entrySchema, body);

      const entry = await DiaryEntry.findOneAndUpdate(
        { _id: id, userId: req.userId },
        payload,
        { new: true }
      );

      if (!entry) {
        const error = new Error('Entry not found');
        error.statusCode = 404;
        throw error;
      }

      return sendJson(res, 200, { success: true, entry: serializeEntry(entry) });
    }

    if (req.method === 'DELETE') {
      const deleted = await DiaryEntry.findOneAndDelete({ _id: id, userId: req.userId });

      if (!deleted) {
        const error = new Error('Entry not found');
        error.statusCode = 404;
        throw error;
      }

      return sendJson(res, 200, { success: true, message: 'Entry deleted' });
    }

    return sendJson(res, 405, { success: false, message: 'Method Not Allowed' });
  } catch (error) {
    handleError(res, error);
  }
}

