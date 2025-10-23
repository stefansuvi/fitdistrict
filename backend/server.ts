import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import clientRoutes from './routes/clientRoutes';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admins';
import { verifyToken } from './middleware/authMiddleware';

dotenv.config();

const app = express();

app.use(express.json());

// ✅ CORS MORA PRE API RUTA
app.use(
  cors({
    origin: [
      "http://localhost:5173",            // lokalno
      "https://fitdistrict.vercel.app",   // frontend na Vercelu ✅
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ MongoDB konekcija
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ Povezano sa MongoDB Atlas"))
  .catch(err => console.error("❌ Greška pri povezivanju sa MongoDB:", err));

// ✅ API rute
app.use('/api/admins', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clients', verifyToken, clientRoutes);

// ✅ Test ruta za backend
app.get('/', (req, res) => {
  res.send('Backend is running ✅');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server radi na portu ${PORT}`)
);
