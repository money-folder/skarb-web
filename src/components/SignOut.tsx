import { signOut } from "@/auth";

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
    >
      <button type="submit" className="hover:underline">
        {text}
      </button>
    </form>
  );
}
