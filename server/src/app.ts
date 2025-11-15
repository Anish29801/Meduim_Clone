import express from 'express';
import userRoutes from './routes/userRoutes';
import articleRoutes from './routes/articleRoutes';
import commentRoutes from './routes/commentRoutes';
import categoryRoutes from './routes/categoryRoutes';
import tagRoutes from './routes/tagRoutes';
import { applyCors } from './middleware/cors';
import path from 'path';

const app = express();
app.use(applyCors);

// Increase JSON payload limit (still needed for text fields)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use((req, res, next) => {
  console.log('➡️ Request:', req.method, req.url);
  next();
});
// Static uploads folder (optional, if any files saved physically)
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../../public/uploads'))
);

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);

export default app;
