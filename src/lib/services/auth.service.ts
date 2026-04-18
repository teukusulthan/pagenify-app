import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/auth/jwt";
import { setAuthCookie, clearAuthCookie } from "@/lib/auth/cookies";
import { ConflictError, UnauthorizedError } from "@/lib/utils/errors";
import type { AuthUser } from "@/types/auth";
import type { RegisterInput, LoginInput } from "@/lib/validations/auth.schema";

export async function registerUser(
  input: RegisterInput
): Promise<{ user: AuthUser; token: string }> {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: input.email }, { username: input.username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === input.email) {
      throw new ConflictError("Email already registered");
    }
    throw new ConflictError("Username already taken");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      passwordHash,
    },
    select: { id: true, username: true, email: true },
  });

  const token = await signJwt({
    userId: user.id,
    username: user.username,
  });

  await setAuthCookie(token);

  return { user, token };
}

export async function loginUser(
  input: LoginInput
): Promise<{ user: AuthUser; token: string }> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatch) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const token = await signJwt({
    userId: user.id,
    username: user.username,
  });

  await setAuthCookie(token);

  return {
    user: { id: user.id, username: user.username, email: user.email },
    token,
  };
}

export async function logoutUser(): Promise<void> {
  await clearAuthCookie();
}
