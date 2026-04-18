import { getCurrentUser } from "./get-current-user";
import { UnauthorizedError } from "@/lib/utils/errors";
import type { AuthUser } from "@/types/auth";

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
}
