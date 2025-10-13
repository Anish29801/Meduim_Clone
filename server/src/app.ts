import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import articleRoutes from "./routes/articleRoutes";
import commentRoutes from "./routes/commentRoutes";
import categoryRoutes from "./routes/categoryRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/articles", articleRoutes);
app.use("/comments", commentRoutes);
app.use("/categories", categoryRoutes);

export default app;
