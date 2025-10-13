import express from 'express';
import cors from 'cors';
import userRouter from './routers/user';

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Test root route =====
app.get('/', (req, res) => res.send('Server is alive! 🚀'));

// ===== User routes =====
app.use('/users', userRouter);

export default app;
