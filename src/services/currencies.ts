import { auth } from "@/auth";
import { findUserCurrencies } from "@/app/[locale]/currencies/repository";
import { ErrorCauses } from "@/types/errors";

export const getCurrentUserCurrencies = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  return await findUserCurrencies(session.user.id);
};
