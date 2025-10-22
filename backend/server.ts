import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import clientRoutes from './routes/clientRoutes';
import authRoutes from './routes/auth'; 
import adminRoutes from './routes/admins';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use(
  cors({
    origin: [
      "http://localhost:5173", // za lokalni frontend
      "fitdistrict-a54jr80af-stefansuvis-projects.vercel.app", // 🔹 tvoj pravi frontend link na Vercelu
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// MongoDB Atlas konekcija
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('Povezano sa MongoDB Atlas'))
  .catch(err => console.error('Greška pri povezivanju sa MongoDB:', err));

// API rute
app.use('/api/clients', clientRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server radi na portu ${PORT}`));
