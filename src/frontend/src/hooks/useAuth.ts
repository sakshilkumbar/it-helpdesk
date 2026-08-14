import type { AppRole, ResolverTier, User } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useBackend } from "./useBackend";

export interface AuthState {
  identity: ReturnType<typeof useInternetIdentity>["identity"];
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoggingIn: boolean;
  isLoginError: boolean;
  loginError: Error | undefined;
  login: ReturnType<typeof useInternetIdentity>["login"];
  clear: () => void;
  user: User | null;
  role: AppRole | null;
  resolverTier: ResolverTier | null;
  isLoadingUser: boolean;
}

/**
 * useAuth — top-level auth hook.
 * Combines Internet Identity session with backend caller role/user/tier lookup.
 *
 * After successful II auth, the caller's backend role is fetched and used to
 * route to the correct role dashboard. Unknown/unassigned users default to
 * the Employee experience (handled by roleHelpers.normalizeRole downstream).
 */
export function useAuth(): AuthState {
  const ii = useInternetIdentity();
  const { actor } = useBackend();

  const isAuthenticated = ii.isAuthenticated;

  const userQuery = useQuery({
    queryKey: ["auth", "currentUser", isAuthenticated],
    enabled: isAuthenticated && !!actor,
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const role = (await actor.getCallerAppRole()) as AppRole | null;
      const user = (await actor.getCallerUser()) as User | null;
      const resolverTier =
        (await actor.getCallerResolverTier()) as ResolverTier | null;
      return { role, user, resolverTier };
    },
    staleTime: 60_000,
  });

  return {
    identity: ii.identity,
    isAuthenticated,
    isInitializing: ii.isInitializing,
    isLoggingIn: ii.isLoggingIn,
    isLoginError: ii.isLoginError,
    loginError: ii.loginError,
    login: ii.login,
    clear: ii.clear,
    user: userQuery.data?.user ?? null,
    role: userQuery.data?.role ?? null,
    resolverTier: userQuery.data?.resolverTier ?? null,
    isLoadingUser: userQuery.isLoading,
  };
}

/**
 * useCurrentUser — convenience hook returning the current authenticated
 * user + role. Throws-free; returns nulls while loading.
 */
export function useCurrentUser() {
  const { user, role, resolverTier, isLoadingUser, isAuthenticated } =
    useAuth();
  return { user, role, resolverTier, isLoadingUser, isAuthenticated };
}
