//src/app/Services/userService.ts
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import { CreateUserInput } from '../types/types';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string; // load from dotenv.config()

// ===== Create / Register User =====
export const createUser = async (data: CreateUserInput) => {
  const { username, email, password, fullName, bio, avatar, gender, role } =
    data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      fullName,
      bio,
      avatar,
      gender,
      role: role || 'USER',
      status: 'ACTIVE',
    },
  });

  // Remove password before returning
  const { password: _, ...safeUser } = user;
  return safeUser;
};

// ===== Login User =====
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  // block inactive users
  if (user.status === 'INACTIVE') {
    throw new Error('Your account is inactive. Please contact admin.');
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalied credentials');
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );

  const { password: _, ...safeUser } = user;
  return { ...safeUser, token };
};
