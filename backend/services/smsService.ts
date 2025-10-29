import dotenv from 'dotenv';
dotenv.config();

import twilio from "twilio";
import { IClient } from "../models/Client";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export const sendExpiryReminder = async (clientData: IClient) => {
  try {
    const message = await client.messages.create({
      body: `Pozdrav ${clientData.firstName}! Zelim danas na Anderson cucnju da radim sa 200 kila.`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: clientData.phoneNumber
    });

    console.log("✅ SMS poslat klijentu:", clientData.phoneNumber);
    return message;
  } catch (err) {
    console.error("❌ Greška pri slanju SMS-a:", err);
  }
};
