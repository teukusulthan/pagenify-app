import { getAuthCookie } from "./cookies";
import { verifyJwt } from "./jwt";
import { prisma } from "@/lib/prisma";
import type { AuthUser } from "@/types/auth";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = await getAuthCookie();
  if (!token) return null;

  const payload = await verifyJwt(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, username: true, email: true },
  });

  return user;
}
