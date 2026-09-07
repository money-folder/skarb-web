import { z } from "zod";

import { authFormSchema } from "./validation";

export type AuthFormValues = z.infer<typeof authFormSchema>;

export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "USERNAME_TAKEN"
  | "VALIDATION"
  | "UNKNOWN";

export type AuthActionResult =
  | { success: true }
  | { success: false; error: AuthErrorCode };
