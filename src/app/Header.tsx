import { auth } from "@/auth";
import { SignIn } from "@/components/SignIn";
import { SignOut } from "@/components/SignOut";

export default async function Header() {
  const session = await auth();

  return (
    <header className="px-5 flex justify-end">
      <div className="flex gap-5">
        {session ? session.user?.name : null}
        {session ? <SignOut /> : <SignIn />}
      </div>
    </header>
  );
}
