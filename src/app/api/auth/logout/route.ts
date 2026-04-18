import { logoutUser } from "@/lib/services/auth.service";
import { apiSuccess } from "@/lib/utils/api-response";

export async function POST() {
  await logoutUser();
  return apiSuccess("Logged out successfully", null);
}
