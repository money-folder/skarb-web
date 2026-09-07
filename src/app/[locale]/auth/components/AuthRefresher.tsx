"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { refresh } from "../actions";
import { AuthActionResult } from "../types";

// Single-flight guard: React StrictMode mounts effects twice in development and
// the sidebar may render more than once; only one refresh() call should be made.
let inFlight: Promise<AuthActionResult> | null = null;

/**
 * Rendered only when the user has no valid access token but still carries a
 * refresh_token cookie. Rotates the tokens once and re-renders the page.
 */
export const AuthRefresher = () => {
  const router = useRouter();

  useEffect(() => {
    inFlight ??= refresh().finally(() => {
      inFlight = null;
    });

    inFlight.then((result) => {
      if (result.success) {
        router.refresh();
      }
    });
  }, [router]);

  return null;
};
