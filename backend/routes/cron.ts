import { Router } from 'express';
import { Client } from '../models/Client';
import { sendExpiryReminder } from '../services/smsService';
import dayjs from 'dayjs';

const router = Router();

router.get('/send-reminders', async (req, res) => {
  try {
    const today = dayjs();
    const targetDate = today.add(3, 'day').format("YYYY-MM-DD");

    const clients = await Client.find({ membershipExpiry: targetDate });

    for (const c of clients) {
      await sendExpiryReminder(c);
    }

    return res.json({ success: true, count: clients.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
});

export default router;
