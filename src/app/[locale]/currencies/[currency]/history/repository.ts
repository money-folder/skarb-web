import { prisma } from "@/prisma";

export const findUserCurrencies = async (userId: string) => {
  const data = await prisma.wallet.groupBy({
    by: ["currency"],

    where: {
      ownerId: userId,
    },
  });

  return data.map((d) => d.currency);
};
