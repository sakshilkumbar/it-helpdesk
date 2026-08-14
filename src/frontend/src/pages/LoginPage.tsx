import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  AlertCircle,
  ChevronRight,
  KeyRound,
  LifeBuoy,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const REMEMBER_KEY = "ithd:ii:remember";

/**
 * LoginPage — branded corporate split-layout sign-in for IT Helpdesk.
 *
 * Left brand panel: petrol-teal gradient with logo, tagline, and trust marks.
 * Right form panel: off-white card with the Internet Identity sign-in CTA,
 * loading state, error messaging, Remember-Me preference, and a
 * "Forgot Password" affordance that opens an Internet Identity recovery info
 * panel (no fake password reset flow).
 */
export function LoginPage() {
  const { login, isLoggingIn, isInitializing, isLoginError, loginError } =
    useInternetIdentity();
  const isBusy = isInitializing || isLoggingIn;

  const [remember, setRemember] = useState<boolean>(() => {
    try {
      return localStorage.getItem(REMEMBER_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [recoveryOpen, setRecoveryOpen] = useState(false);

  const handleSignIn = () => {
    try {
      if (remember) {
        localStorage.setItem(REMEMBER_KEY, "1");
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
    } catch {
      /* storage may be unavailable; ignore */
    }
    login();
  };

  const errorMessage = isLoginError
    ? loginError?.message
      ? humanizeIiError(loginError.message)
      : "We couldn't complete sign-in with Internet Identity. Please try again."
    : null;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* ---------- Brand panel ---------- */}
      <aside
        className="relative hidden flex-col justify-between overflow-hidden p-10 text-[oklch(var(--login-brand-foreground))] lg:flex"
        style={{ backgroundImage: "var(--gradient-brand)" }}
      >
        {/* decorative glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "oklch(var(--login-brand-accent))" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "oklch(var(--login-brand-foreground))" }}
        />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[oklch(var(--login-brand-foreground))] text-[oklch(var(--login-brand))] shadow-elevated">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold tracking-tight">
              IT Helpdesk
            </span>
            <span className="text-xs opacity-80">
              Enterprise Support Platform
            </span>
          </div>
        </div>

        <div className="relative space-y-6">
          <div className="space-y-3">
            <h1 className="max-w-md font-display text-3xl font-semibold leading-tight tracking-tight">
              Enterprise-grade IT support, secured by Internet Identity.
            </h1>
            <p className="max-w-md text-sm leading-relaxed opacity-85">
              Submit tickets, track SLAs, and resolve issues across your
              organization. Passwordless sign-in keeps your account safe — no
              passwords to lose or leak.
            </p>
          </div>

          <ul className="space-y-3 text-sm">
            {[
              "Four role-based workspaces: Employee, L1, L2, Admin",
              "Real-time SLA monitoring and escalation tracking",
              "Global search across tickets, knowledge, and users",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 opacity-90" />
                <span className="opacity-90">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-2 text-xs opacity-70">
          <Lock className="h-3.5 w-3.5" />
          <span>Secured by Internet Computer · Internet Identity</span>
        </div>
      </aside>

      {/* ---------- Form panel ---------- */}
      <main className="flex items-center justify-center bg-[oklch(var(--login-form))] px-4 py-10 text-[oklch(var(--login-form-foreground))]">
        <div className="w-full max-w-md">
          {/* Mobile brand header */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-[oklch(var(--login-brand-foreground))] shadow-elevated"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              <LifeBuoy className="h-6 w-6" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-semibold tracking-tight">
                IT Helpdesk
              </span>
              <span className="text-xs text-muted-foreground">
                Enterprise Support Platform
              </span>
            </div>
          </div>

          <Card className="shadow-login">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Sign in
              </CardTitle>
              <CardDescription>
                Use Internet Identity to access your workspace. Your role is
                assigned automatically after sign-in.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Error message */}
              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-medium">Sign-in failed</p>
                    <p className="text-xs opacity-90">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Trust banner */}
              <div className="flex items-start gap-3 rounded-lg border bg-card/60 p-3.5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium">Secure, passwordless sign-in</p>
                  <p className="text-xs text-muted-foreground">
                    Internet Identity uses your device's secure authentication.
                    No password is ever stored or transmitted.
                  </p>
                </div>
              </div>

              {/* Primary CTA */}
              <Button
                type="button"
                className="group w-full"
                size="lg"
                disabled={isBusy}
                onClick={handleSignIn}
                data-ocid="ii_signin_button"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting to Internet Identity…
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Continue with Internet Identity
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>

              {/* Remember me + forgot password */}
              <div className="flex items-center justify-between">
                <label
                  htmlFor="remember-me"
                  className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"
                >
                  <Checkbox
                    id="remember-me"
                    checked={remember}
                    onCheckedChange={(v) => setRemember(v === true)}
                    aria-label="Remember my sign-in preference"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setRecoveryOpen(true)}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Separator />

              {/* Footer note */}
              <div className="flex items-start gap-2.5 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <p>
                  New here? After your first sign-in an administrator will
                  assign your role. Until then you'll land on the Employee
                  workspace.
                </p>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                By signing in you agree to the platform acceptable use policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* ---------- Recovery info dialog ---------- */}
      <Dialog open={recoveryOpen} onOpenChange={setRecoveryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              Internet Identity recovery
            </DialogTitle>
            <DialogDescription>
              IT Helpdesk uses Internet Identity for sign-in — there is no
              separate password to reset. Manage your recovery anchors directly
              in Internet Identity.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div className="space-y-2">
              <p className="font-medium">What is an anchor?</p>
              <p className="text-muted-foreground">
                An anchor is a recovery method tied to your Internet Identity —
                such as a device passkey, a phone number, or a seed phrase. Add
                several anchors so you can always regain access if one is lost.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">How to add or remove anchors</p>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>Open the Internet Identity application in your browser.</li>
                <li>Sign in with your existing anchor.</li>
                <li>
                  Use <span className="font-medium">Add a new device</span> or
                  the recovery options to add a passkey, phone, or seed phrase.
                </li>
                <li>Remove any anchor you no longer control.</li>
              </ol>
            </div>
            <div className="flex items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-xs">
                If you've lost all anchors, contact your IT administrator — they
                can re-issue access from the admin workspace.
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setRecoveryOpen(false)}
              className="gap-1.5"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Map raw II error strings to friendlier copy. */
function humanizeIiError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("user cancel") || m.includes("cancelled")) {
    return "Sign-in was cancelled. You can try again whenever you're ready.";
  }
  if (m.includes("no delegation") || m.includes("delegation")) {
    return "Your Internet Identity session could not be verified. Please sign in again.";
  }
  if (m.includes("network") || m.includes("timeout") || m.includes("fetch")) {
    return "We couldn't reach Internet Identity. Check your connection and try again.";
  }
  return msg;
}

export default LoginPage;
