import prisma from "../prisma";
import bcrypt from "bcrypt";
import { CreateUserInput } from "../types/types";

// ===== Create / Register User =====
export const createUser = async (data: CreateUserInput) => {
  const { username, email, password, fullName, bio, avatar, gender, role } = data;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ Auto-generate username if not provided
  const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
  const uniqueSuffix = Math.floor(Math.random() * 10000);
  const safeUsername = username || `${baseUsername}_${uniqueSuffix}`;

  const user = await prisma.user.create({
    data: {
      username: safeUsername,
      email,
      password: hashedPassword,
      fullName,
      bio,
      avatar,
      gender,
      role: role || "USER",
    },
  });

  // Return safe user object
  const { password: _, ...safeUser } = user;
  return safeUser;
};

// ===== Login User =====
export const loginUser = async (email: string, password: string) => {
  if (!email || !password) throw new Error("Email and password are required");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  const { password: _, ...safeUser } = user;
  return safeUser;
};
