// src/app.ts
import express from 'express';
import userRoutes from './routes/userRoutes';
import articleRoutes from './routes/articleRoutes';
import commentRoutes from './routes/commentRoutes';
import categoryRoutes from './routes/categoryRoutes';

const app = express();

app.use(express.json());

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);

export default app;
