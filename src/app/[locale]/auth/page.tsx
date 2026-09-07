import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";

import AuthForm from "./components/AuthForm";

interface Props {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function AuthPage(props: Props) {
  const { locale } = await props.params;

  const session = await auth();
  if (session) {
    redirect(`/${locale}`);
  }

  const d = await getDictionary(locale, "authPage");

  return (
    <main className="w-full">
      <h1 className="w-full text-center text-lg font-extrabold">{d.title}</h1>
      <div className="mt-10 flex w-full justify-center">
        <div className="w-full max-w-sm">
          <AuthForm />
        </div>
      </div>
    </main>
  );
}
