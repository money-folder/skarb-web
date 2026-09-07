import { prisma } from "@/prisma";

// Explicit select: the password hash must never leave the database via export.
export const getUserAppData = (userId: string) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      wallets: {
        include: {
          history: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
      expenses: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
