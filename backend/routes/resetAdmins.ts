// backend/routes/resetAdmins.ts
import { Router } from 'express';
import { Admin } from '../models/Admin';

const router = Router();

// POST /api/reset-admins
router.post('/reset-admins', async (req, res) => {
  try {
    const { secret } = req.body;
    if (secret !== process.env.RESET_ADMINS_SECRET) {
      return res.status(403).json({ success: false, message: 'Nemaš dozvolu za ovu akciju.' });
    }

    // Obrisi stare admin-e
    await Admin.deleteMany({});

    // Kreiraj nove admin-e — NOTE: NE HASHUJEMO OVDE, pre('save') hook u modelu radi hash
    const admins = [
      { username: 'Marko', password: 'Marko123' },
      { username: 'Nenad', password: 'Nenad123' },
      { username: 'Aleksa', password: 'Aleksa123' }
    ];

    for (const a of admins) {
      await Admin.create({ username: a.username, password: a.password });
    }

    return res.json({ success: true, message: 'Svi admini su resetovani.' });
  } catch (err) {
    console.error('Greška pri resetovanju admina:', err);
    return res.status(500).json({ success: false, message: 'Greška servera.' });
  }
});

export default router;
