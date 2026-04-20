import { cache } from "react";
import { getAuthCookie } from "./cookies";
import { verifyJwt } from "./jwt";
import { prisma } from "@/lib/prisma";
import type { AuthUser } from "@/types/auth";

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const token = await getAuthCookie();
  if (!token) return null;

  const payload = await verifyJwt(token);
  if (!payload) return null;

  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, username: true, email: true },
  });
});
