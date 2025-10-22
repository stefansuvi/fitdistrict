import express from 'express';
import { Client } from '../models/Client';
import mongoose from 'mongoose';

const router = express.Router();

// GET svi klijenti
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dohvatanju klijenata', error: err });
  }
});

// POST novi klijent
router.post('/', async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dodavanju klijenta', error: err });
  }
});

// PUT izmena klijenta (npr. membershipExpiry)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Neispravan ID klijenta' });
    }

    const updatedClient = await Client.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedClient) {
      return res.status(404).json({ message: 'Klijent nije pronađen' });
    }

    res.json(updatedClient);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri ažuriranju klijenta', error: err });
  }
});

// DELETE klijent
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Neispravan ID klijenta' });
    }

    const deletedClient = await Client.findByIdAndDelete(id);
    if (!deletedClient) {
      return res.status(404).json({ message: 'Klijent nije pronađen' });
    }

    res.json({ message: 'Klijent obrisan' });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri brisanju klijenta', error: err });
  }
});

export default router;
