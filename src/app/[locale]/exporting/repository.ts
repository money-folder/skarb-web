import { prisma } from "@/prisma";

export const getUserAppData = (userId: string) =>
  prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallets: {
        include: {
          history: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });
