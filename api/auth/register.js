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

    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      const error = new Error('Email is already registered');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const user = await User.create({
      email: payload.email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return sendJson(res, 201, {
      success: true,
      message: 'Registration successful',
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

