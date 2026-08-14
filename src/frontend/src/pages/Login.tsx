import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { LifeBuoy, Loader2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Login — entry point for unauthenticated users.
 * Presents the IT Helpdesk brand and a single Internet Identity sign-in action.
 */
export function Login() {
  const { login, isLoggingIn, isInitializing } = useInternetIdentity();
  const isBusy = isInitializing || isLoggingIn;

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md shadow-subtle">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LifeBuoy className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              IT Helpdesk
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Enterprise support platform. Sign in with Internet Identity to
              access your workspace.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-card/50 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  Secure, passwordless sign-in
                </p>
                <p>
                  Your role is assigned automatically based on your Internet
                  Identity principal.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            type="button"
            className="w-full"
            size="lg"
            disabled={isBusy}
            onClick={() => login()}
          >
            {isBusy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting…
              </>
            ) : (
              "Sign in with Internet Identity"
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            By signing in you agree to the platform acceptable use policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
