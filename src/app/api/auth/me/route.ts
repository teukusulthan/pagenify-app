import { getCurrentUser } from "@/lib/auth/get-current-user";
import { apiSuccess, apiUnauthorized } from "@/lib/utils/api-response";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return apiUnauthorized();
  }

  return apiSuccess("Authenticated user", { user });
}
