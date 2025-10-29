import dotenv from "dotenv";
import mongoose from "mongoose";
import { Client, IClient } from "./models/Client";
import { sendExpiryReminder } from "./services/smsService";

dotenv.config();

// Povezivanje sa MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ Povezano sa MongoDB Atlas");
  } catch (err) {
    console.error("❌ Greška pri povezivanju sa MongoDB:", err);
    process.exit(1);
  }
}

console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER);

// Funkcija za pronalaženje klijenata i slanje poruka
async function sendReminders() {
  await connectDB();

  const today = new Date();
  today.setDate(today.getDate() + 3); // datum 3 dana unapred

  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  const year = today.getFullYear();

  const targetDateStr = `${year}-${month}-${day}`; // npr. "2025-10-27"

  try {
    const clientsToNotify: IClient[] = await Client.find({
      membershipExpiry: targetDateStr,
    });

    console.log(`Klijenti kojima ističe članarina za 3 dana (${targetDateStr}):`, clientsToNotify);

    for (const client of clientsToNotify) {
      await sendExpiryReminder(client);
    }

    console.log("✅ Sve poruke poslate");
  } catch (err) {
    console.error("❌ Greška pri slanju poruka:", err);
  } finally {
    mongoose.disconnect();
  }
}

// Pokreni skriptu
sendReminders();
