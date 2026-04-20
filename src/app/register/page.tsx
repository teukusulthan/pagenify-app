import { RegisterForm } from "@/components/auth/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants/app";
import { Sparkle } from "@phosphor-icons/react/dist/ssr";

export default function RegisterPage() {
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
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15">
            <Sparkle className="h-4 w-4 text-primary" weight="fill" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {APP_NAME}
          </span>
        </div>

        <Card className="border-border/40 bg-card/80 shadow-xl backdrop-blur-sm">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Create account
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground">
              Start building AI-powered sales pages in minutes.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
