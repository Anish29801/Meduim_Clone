// src/app.ts
import express from "express";
import userRoutes from "./routes/userRoutes";
import articleRoutes from "./routes/articleRoutes";
import commentRoutes from "./routes/commentRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import tagRoutes from "./routes/tagRoutes";
import { applyCors } from "./middleware/cors";

const app = express();

app.use(applyCors);
app.use(express.json());

// Register routes
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);

export default app;
