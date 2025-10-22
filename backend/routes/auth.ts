// backend/routes/auth.ts
import express from 'express';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Neispravno korisničko ime ili lozinka' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Neispravno korisničko ime ili lozinka' });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška na serveru' });
  }
});

export default router;
