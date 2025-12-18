import { signOut } from "@/auth";
import { LogOut } from "lucide-react";

interface Props {
  text: string;
}

export function SignOut({ text }: Props) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="w-full"
    >
      <button type="submit" className="flex w-full items-center gap-2 text-sm">
        <LogOut className="h-4 w-4" />
        {text}
      </button>
    </form>
  );
}
