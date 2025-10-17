// src/middleware/cors.ts
import cors from "cors";

export const corsOptions = {
  origin: "http://localhost:3000", // frontend URL
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

export const applyCors = cors(corsOptions);
