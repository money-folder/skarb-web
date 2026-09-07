"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DictionaryContext } from "@/shared/components/Dictionary";

import { login, register } from "../actions";
import { AuthErrorCode, AuthFormValues } from "../types";
import { authFormSchema } from "../validation";

const AuthForm = () => {
  const { d, locale } = useContext(DictionaryContext);
  const router = useRouter();

  const [error, setError] = useState<AuthErrorCode | null>(null);
  const [registered, setRegistered] = useState(false);

  const methods = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
  });

  const { errors, isSubmitting } = methods.formState;

  const errorMessages: Record<AuthErrorCode, string> = {
    INVALID_CREDENTIALS: d.authPage.invalidCredentials,
    USERNAME_TAKEN: d.authPage.usernameTaken,
    VALIDATION: d.authPage.unknownError,
    UNKNOWN: d.authPage.unknownError,
  };

  const onLoginClick = async () => {
    const isValid = await methods.trigger();
    if (!isValid) {
      return;
    }

    setError(null);
    setRegistered(false);

    const formData = methods.getValues();
    const result = await login(formData);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.push(`/${locale}`);
    router.refresh();
  };

  const onRegisterClick = async () => {
    const isValid = await methods.trigger();
    if (!isValid) {
      return;
    }

    setError(null);
    setRegistered(false);

    const formData = methods.getValues();
    const result = await register(formData);
    if (!result.success) {
      setError(result.error);
      return;
    }

    methods.resetField("password");
    setRegistered(true);
  };

  return (
    <form>
      <div className="space-y-5">
        <div className="flex w-full flex-col items-start gap-3">
          <Label htmlFor="authUsername">{d.authPage.usernameLabel}</Label>
          <Input
            {...methods.register("username")}
            id="authUsername"
            type="text"
            autoComplete="username"
            autoFocus
          />
          {errors.username && (
            <p className="text-sm text-destructive">
              {d.authPage.usernameInvalid}
            </p>
          )}
        </div>
        <div className="flex w-full flex-col items-start gap-3">
          <Label htmlFor="authPassword">{d.authPage.passwordLabel}</Label>
          <Input
            {...methods.register("password")}
            id="authPassword"
            type="password"
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {d.authPage.passwordInvalid}
            </p>
          )}
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {errorMessages[error]}
          </p>
        )}
        {registered && (
          <p role="status" className="text-sm">
            {d.authPage.registered}
          </p>
        )}
      </div>
      <div className="mt-10 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={onRegisterClick}
        >
          {d.authPage.registerButton}
        </Button>
        <Button type="button" disabled={isSubmitting} onClick={onLoginClick}>
          {d.authPage.signinButton}
        </Button>
      </div>
    </form>
  );
};

export default AuthForm;
