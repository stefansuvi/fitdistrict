import mongoose from "mongoose";
import dotenv from "dotenv";
import dayjs from "dayjs";
import { Client } from "../models/Client";
import { sendExpiryReminder } from "../services/smsService";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  const targetDate = dayjs().add(3, "day").format("YYYY-MM-DD");

  const expiringClients = await Client.find({
    membershipExpiry: targetDate,
  });

  console.log(`🎯 Klijenata za obaveštavanje: ${expiringClients.length}`);

  for (const client of expiringClients) {
    await sendExpiryReminder(client);
  }

  mongoose.connection.close();
  process.exit(0);
};

run();
