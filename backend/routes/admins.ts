import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin'; 
import jwt from 'jsonwebtoken';

const router = Router();

// Basic rate limiting for login to mitigate brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});

// POST /api/admins/login
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Unesi username i password' });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Neispravno korisničko ime ili lozinka' });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Neispravno korisničko ime ili lozinka' });
    }

    return res.json({
      success: true,
      username: admin.username,
      token: jwt.sign(
        { id: admin._id, username: admin.username },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      )
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Greška servera' });
  }
});

export default router;
