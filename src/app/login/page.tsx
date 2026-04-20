import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-[26rem]">

        <Card className="border-border/40 bg-card/80 shadow-xl backdrop-blur-sm">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground">
              Sign in to continue managing your sales pages.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
