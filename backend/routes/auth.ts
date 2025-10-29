// backend/routes/auth.ts
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';

const router = express.Router();

// Make this route consistent with /api/admins/login for future compatibility
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Unesi username i password' });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Neispravno korisničko ime ili lozinka' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Neispravno korisničko ime ili lozinka' });
    }

    return res.json({
      success: true,
      username: admin.username,
      token: jwt.sign(
        { id: admin._id, username: admin.username },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      )
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Greška servera' });
  }
});

export default router;
