import prisma from "../prisma";
import bcrypt from "bcrypt";
import { CreateUserInput } from "../types/types";

// ===== Create / Register User =====
export const createUser = async (data: CreateUserInput) => {
  const { username, email, password, fullName, bio, avatar, gender, isAdmin } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

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
      isAdmin: isAdmin || false,
    },
  });

  return user;
};

// ===== Login User =====
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  return user;
};
