// src/index.ts
import app from "./app";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // Connect to MySQL
    await prisma.$connect();
    console.log("✅ MySQL Database Connected");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🌍 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database Connection Error:", err);
    process.exit(1);
  }
}

start();
