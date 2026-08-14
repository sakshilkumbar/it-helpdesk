import { type Backend, createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Actor — the live backend actor type returned by createActor.
 */
export type Actor = Backend;

/**
 * Options accepted by useApi. Mirrors the subset of TanStack Query options
 * that callers commonly need (currently just the `enabled` flag).
 */
export interface UseApiOptions {
  enabled?: boolean;
}

/**
 * useBackend — exposes the live backend actor.
 * useActor(createActor) returns { actor, isFetching }.
 */
export function useBackend() {
  const { actor, isFetching } = useActor(createActor);
  return { actor: (actor ?? null) as Actor | null, isFetching };
}

/**
 * useApi — helper that wraps a backend call in a TanStack Query.
 * Pass a query key and a function that receives the actor.
 * The optional third argument accepts { enabled?: boolean }.
 */
export function useApi<T>(
  queryKey: Parameters<typeof useQuery>[0]["queryKey"],
  queryFn: (actor: Actor) => Promise<T>,
  options?: UseApiOptions,
) {
  const { actor } = useBackend();
  return useQuery<T>({
    queryKey,
    enabled: !!actor && (options?.enabled ?? true),
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return queryFn(actor);
    },
  });
}

/**
 * useApiMutation — wraps a mutating backend call.
 */
export function useApiMutation<TVars, TResult>(
  mutationFn: (actor: Actor, vars: TVars) => Promise<TResult>,
) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<TResult, Error, TVars>({
    mutationFn: async (vars: TVars) => {
      if (!actor) throw new Error("Actor not ready");
      return mutationFn(actor, vars);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries();
    },
  });
}
