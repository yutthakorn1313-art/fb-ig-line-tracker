// ============ IMPORT ============
import express from "express";
import bodyParser from "body-parser";
import { Client } from "@line/bot-sdk";

// ============ APP ============
const app = express();
app.use(bodyParser.json());

// ============ ENV ============
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const CHANNEL_SECRET = process.env.CHANNEL_SECRET;
const RECIPIENT_ID = process.env.RECIPIENT_ID;

if (!CHANNEL_ACCESS_TOKEN || !CHANNEL_SECRET || !RECIPIENT_ID) {
  console.error("❌ Missing ENV variables");
  process.exit(1);
}

const client = new Client({
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
  channelSecret: CHANNEL_SECRET
});

// ============ TRACK SYSTEM ============
app.get("/track/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const ua = req.headers["user-agent"];
    const time = new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });

    const message = 
      `🔔 มีคนคลิกลิงก์: ${name}\n` +
      `🌐 IP: ${ip}\n` +
      `📱 อุปกรณ์: ${ua}\n` +
      `⏰ เวลา: ${time}`;

    await client.pushMessage(RECIPIENT_ID, {
      type: "text",
      text: message
    });

    res.send("OK");
  } catch (err) {
    console.error("LINE ERROR:", err);
    res.status(500).send("Error");
  }
});

// ============ HOME ============
app.get("/", (req, res) => {
  res.send("LINE Tracker is running.");
});

// ============ START ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
