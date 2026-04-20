import { RegisterForm } from "@/components/auth/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants/app";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-6">
      <Card className="w-full max-w-[28.5rem] border-border/60 shadow-md">
        <CardHeader className="px-6 pt-6 pb-3">
          <div className="mb-1 text-xs font-bold text-white/80">{APP_NAME}</div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Create account
          </CardTitle>
          <CardDescription className="text-xs leading-5">
            Create your account to start managing your pages and workspace.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
