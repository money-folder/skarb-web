import { signIn } from "@/auth";
import { LogIn } from "lucide-react";

interface Props {
  text: string;
}

export function SignIn({ text }: Props) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
      className="w-full"
    >
      <button type="submit" className="flex w-full items-center gap-2 text-sm">
        <LogIn className="h-4 w-4" />
        {text}
      </button>
    </form>
  );
}
