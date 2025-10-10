import app from "./app";
import { connectDB } from "./models/conn";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB(); 

  app.listen(PORT, () => {
    console.log(`🌍 Server running on http://localhost:${PORT}`);
  });
};

startServer();
