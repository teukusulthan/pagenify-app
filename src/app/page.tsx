import { getCurrentUser } from "@/lib/auth/get-current-user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkle,
  Lightning,
  FileText,
  ArrowRight,
  GlobeSimple,
  Robot,
  RocketLaunch,
  PaintBrush,
  CheckCircle,
  AppWindow,
  MagicWand,
} from "@phosphor-icons/react/dist/ssr";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Ambient background glows */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 left-1/3 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-[140px]" />
        <div className="absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-violet-500/4 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-primary/3 blur-[100px]" />
      </div>

      {/* ─── Navbar ─── */}
      <header className="fixed inset-x-0 top-0 z-20 border-b border-border/30 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <span className="text-base font-semibold tracking-tight">Pagenify</span>

          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/dashboard">
                <Button className="gap-1.5">
                  Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="gap-1.5">
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative pb-12 pt-36 text-center sm:pt-44">
        <div className="mx-auto max-w-4xl px-5">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 text-xs font-medium text-primary">
            <Lightning className="h-3 w-3" weight="fill" />
            AI-powered sales page builder
          </div>

          {/* Headline */}
          <h1 className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Turn your product into a{" "}
            <span className="bg-gradient-to-br from-primary via-violet-400 to-primary/70 bg-clip-text text-transparent">
              high-converting
            </span>{" "}
            sales page
          </h1>

          {/* Subtext */}
          <p className="mx-auto mb-9 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Describe your offer, pick a model, and let AI generate a complete,
            beautiful sales page — ready to share in under 2 minutes.
          </p>

          {/* CTA row */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={user ? "/dashboard/pages/new" : "/register"}>
              <Button size="lg" className="h-11 gap-2 px-7 text-sm font-semibold">
                <Sparkle className="h-4 w-4" weight="fill" />
                Start building for free
              </Button>
            </Link>
            <Link href={user ? "/dashboard" : "/login"}>
              <Button
                variant="outline"
                size="lg"
                className="h-11 border-border/40 px-7 text-sm text-muted-foreground hover:text-foreground"
              >
                {user ? "Go to dashboard" : "Sign in"}
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Browser mockup ── */}
        <div className="relative mx-auto mt-16 max-w-5xl px-5">
          <div className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-[0_32px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/5">
            {/* Chrome bar */}
            <div className="flex items-center gap-3 border-b border-border/40 bg-card/80 px-5 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/50" />
              </div>
              <div className="flex flex-1 items-center rounded-md bg-background/50 px-3 py-1.5">
                <span className="text-xs text-muted-foreground/50">
                  pagenify.app/u/yourname/my-product
                </span>
              </div>
            </div>

            {/* Simulated sales page */}
            <div className="bg-gradient-to-br from-[#0d0d18] to-[#080810] p-8 sm:p-10">
              {/* Hero row */}
              <div className="flex items-center gap-8">
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="h-2.5 w-28 rounded-full bg-primary/35" />
                  <div className="space-y-2.5">
                    <div className="h-5 w-4/5 rounded-md bg-white/18" />
                    <div className="h-5 w-3/5 rounded-md bg-white/14" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 w-full rounded bg-white/8" />
                    <div className="h-2 w-11/12 rounded bg-white/8" />
                    <div className="h-2 w-3/4 rounded bg-white/8" />
                  </div>
                  <div className="flex gap-2.5 pt-1">
                    <div className="h-7 w-28 rounded-lg bg-primary/60" />
                    <div className="h-7 w-22 rounded-lg border border-white/15 bg-transparent" />
                  </div>
                </div>
                <div className="hidden h-40 w-48 flex-shrink-0 rounded-xl border border-primary/15 bg-gradient-to-br from-primary/15 to-violet-500/8 sm:block" />
              </div>

              {/* Feature cards row */}
              <div className="mt-7 grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="space-y-2 rounded-lg border border-white/7 bg-white/3 p-4"
                  >
                    <div className="h-3.5 w-3.5 rounded bg-primary/30" />
                    <div className="h-2.5 w-3/4 rounded bg-white/15" />
                    <div className="h-2 w-full rounded bg-white/8" />
                    <div className="h-2 w-5/6 rounded bg-white/8" />
                  </div>
                ))}
              </div>

              {/* CTA strip */}
              <div className="mt-5 rounded-lg border border-primary/20 bg-primary/8 py-4 text-center">
                <div className="mx-auto h-3 w-40 rounded bg-white/15" />
                <div className="mx-auto mt-2 h-2 w-56 rounded bg-white/8" />
                <div className="mx-auto mt-3 h-7 w-28 rounded-lg bg-primary/50" />
              </div>
            </div>
          </div>

          {/* Glow underneath mockup */}
          <div className="absolute -bottom-10 left-1/2 h-40 w-3/4 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              How it works
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              From idea to live page in 3 steps
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                step: "01",
                icon: FileText,
                title: "Describe your offer",
                desc: "Fill in your product title, target audience, key features, and pricing. Plain language — no marketing expertise needed.",
              },
              {
                icon: Robot,
                step: "02",
                title: "AI writes your page",
                desc: "Our AI generates persuasive copy, structures your hero, benefits, pricing, and social proof into a polished sales page.",
              },
              {
                icon: RocketLaunch,
                step: "03",
                title: "Publish and share",
                desc: "Save your page and it's instantly live at a public URL. Share it with customers, embed it, or export the HTML.",
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div
                key={step}
                className="relative rounded-xl border border-border/40 bg-card/40 p-6 backdrop-blur-sm"
              >
                <div className="mb-5 flex items-start justify-between">
                  <span className="text-5xl font-black text-primary/12 leading-none">
                    {step}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-base font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Features
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to sell online
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
              Pagenify handles the design, copy, and publishing — so you can focus on your product.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: MagicWand,
                title: "AI Copywriting",
                desc: "GPT-powered copy tailored to your product and audience. Headlines, benefits, pricing, FAQs — all generated automatically.",
              },
              {
                icon: PaintBrush,
                title: "Professional design",
                desc: "Every page is automatically styled with a clean, conversion-optimized layout. No designer or CSS needed.",
              },
              {
                icon: GlobeSimple,
                title: "Instant public URL",
                desc: "Pages go live the moment you save, at a shareable URL like /u/yourname/your-product. No hosting setup.",
              },
              {
                icon: AppWindow,
                title: "Structured sections",
                desc: "Hero, benefits, features, pricing, testimonials, FAQ, and CTA — all composed and ordered automatically.",
              },
              {
                icon: Lightning,
                title: "Multiple AI models",
                desc: "Choose from fast, balanced, or deep-thinking models. Pick speed or quality depending on your workflow.",
              },
              {
                icon: CheckCircle,
                title: "Full page management",
                desc: "Edit, regenerate, archive, and restore pages from your dashboard. Full lifecycle management built in.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-xl border border-border/40 bg-card/30 p-5 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-card/60"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="mb-1.5 text-sm font-semibold">{title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-violet-500/5 p-12 text-center sm:p-16">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
            </div>
            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary">
                <Sparkle className="h-3 w-3" weight="fill" />
                Start for free — no credit card
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to build your first page?
              </h2>
              <p className="mx-auto mb-8 max-w-sm text-sm text-muted-foreground sm:text-base">
                Join creators using Pagenify to launch products faster than ever before.
              </p>
              <Link href={user ? "/dashboard/pages/new" : "/register"}>
                <Button size="lg" className="h-11 gap-2 px-8 font-semibold">
                  <Sparkle className="h-4 w-4" weight="fill" />
                  {user ? "Create a new page" : "Get started for free"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/30 bg-card/20">
        <div className="mx-auto max-w-7xl px-5">
          {/* Top row */}
          <div className="flex flex-col gap-8 py-12 sm:flex-row sm:justify-between">
            {/* Brand */}
            <div className="max-w-xs">
              <span className="text-base font-semibold tracking-tight">Pagenify</span>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                AI-powered sales pages built for creators, makers, and founders who want to sell faster.
              </p>
            </div>

            {/* Links */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                Product
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/register" className="transition-colors hover:text-foreground">Get started</Link></li>
                <li><Link href="/login" className="transition-colors hover:text-foreground">Sign in</Link></li>
                {user && (
                  <li><Link href="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link></li>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border/30 py-5 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} Teuku Sulthan. All rights reserved.</p>
            <p className="text-muted-foreground/50">Pagenify — Build smarter, sell faster.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
