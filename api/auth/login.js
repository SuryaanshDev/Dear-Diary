import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../utils/db.js';
import User from '../../models/User.js';
import { authSchema, validate } from '../../utils/validators.js';
import { handleError, handleOptions, parseJsonBody, sendJson } from '../../utils/http.js';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, message: 'Method Not Allowed' });
  }

  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    await connectDB();
    const body = await parseJsonBody(req);
    const payload = await validate(authSchema, body);

    const user = await User.findOne({ email: payload.email });

    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(payload.password, user.password);

    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return sendJson(res, 200, {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    handleError(res, error);
  }
}

