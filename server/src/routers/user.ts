import { Router, Request, Response } from 'express';
import { createUser, loginUser } from '../services/userService';

const router = Router();

// ===== Test GET route =====
router.get('/', (req, res) => {
  res.send('User route is working! ✅');
});

// Signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await createUser(username, email, password);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
