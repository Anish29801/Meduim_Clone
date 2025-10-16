import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Create (Signup)
interface CreateUserInput {
  username: string;
  fullName?: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: 'male' | 'female';
  gender?: string;
  role?: 'USER' | 'ADMIN' | 'SUBADMIN';
}

export const createUser = async (data: CreateUserInput) => {
  const { username, fullName, email, password, bio, avatar, gender, role } =
    data;

  // Check if user exists
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existingUser) throw new Error('User already exists');

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      fullName,
      email,
      password: hashedPassword,
      bio,
      avatar,
      gender,
      role: role || 'USER',
    },
  });

  return {
    message: 'Signup successful',
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      gender: user.gender,
      role: user.role,
    },
  };
};

// Login
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    message: 'Login successful',
    token,
    user: { id: user.id, username: user.username, email: user.email },
  };
};
