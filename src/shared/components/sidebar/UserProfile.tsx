import Image from "next/image";

import { auth } from "@/auth";
import { getDictionary } from "@/dictionaries";
import { getServerLocale } from "@/getServerLocale";
import { SignIn } from "../SignIn";

export default async function UserProfile() {
  const session = await auth();

  const locale = getServerLocale();
  const d = await getDictionary(locale);

  return (
    <div className="w-full">
      {session?.user ? (
        <div className="flex w-full flex-col items-center">
          <div className="w-fit overflow-hidden rounded-full">
            <Image
              src={session.user.image!}
              width={128}
              height={128}
              alt="user profile"
            />
          </div>
          <h3 className="mt-5 text-lg">{session?.user.name}</h3>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center">
          <div className="w-fit overflow-hidden rounded-full">
            <div className="h-[128px] w-[128px] bg-gray-200"></div>
          </div>

          <div className="mt-5">
            <SignIn text={d.sidebar.githubSigninLabel} />
          </div>
        </div>
      )}
    </div>
  );
}
