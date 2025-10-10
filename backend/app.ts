import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "🚀 Medium Clone API running!" });
});

export default app;
