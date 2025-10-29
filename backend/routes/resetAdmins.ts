// backend/routes/resetAdmins.ts
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';

const router = Router();

// OVO JE SAMO ZA PRIVREMENU UPOTREBU
// Resetuje sve postojeće admin-e i kreira nove sa poznatim lozinkama
router.post('/', async (req, res) => {
  // OPTIONAL: dodaj neki "password" parametar da niko drugi ne može da pokrene
  const { secret } = req.body;
  if (secret !== process.env.RESET_ADMINS_SECRET) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const admins = [
    { username: 'Marko', password: 'Marko123' },
    { username: 'Nenad', password: 'Nenad123' },
    { username: 'Aleksa', password: 'Aleksa123' },
  ];

  try {
    // obriši sve postojeće admin-e
    await Admin.deleteMany({});
    
    // kreiraj nove sa hashovanim lozinkama
    for (const adminData of admins) {
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      await Admin.create({ username: adminData.username, password: hashedPassword });
    }

    res.json({ success: true, message: 'Svi admin-i su resetovani' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Greška servera' });
  }
});

export default router;
