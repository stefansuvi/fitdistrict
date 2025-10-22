import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';

const router = Router();

// POST /api/admins/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Unesi username i password' });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Neispravno korisničko ime ili lozinka' });
    }

    // Ako su lozinke hashovane
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Neispravno korisničko ime ili lozinka' });
    }

    // Ako je sve ok
    return res.json({ success: true, username: admin.username });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Greška servera' });
  }
});

export default router;
