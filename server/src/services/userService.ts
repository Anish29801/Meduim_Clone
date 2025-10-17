// service/userService.ts
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import { CreateUserInput } from '../types/types';
import { Role } from '@prisma/client'; // Prisma Role enum

// ===== Create / Register User =====
export const createUser = async (data: CreateUserInput) => {
  const { username, email, password, fullName, bio, avatar, gender, role } =
    data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('User already exists');

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Validate role
  const userRole: Role =
    role && Object.values(Role).includes(role as Role)
      ? (role as Role)
      : Role.USER;

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      fullName,
      bio,
      avatar,
      gender,
      role: userRole, // safe enum
    },
  });

  return user;
};

// ===== Login User =====
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  return user;
};
