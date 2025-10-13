import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid password');

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });

  return { user, token };
};
