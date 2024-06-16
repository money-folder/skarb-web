import { NextResponse } from "next/server";

import { auth } from "@/auth";
import * as walletsRepository from "@/repositories/wallets";

export const GET = async () => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wallets = await walletsRepository.findByUser(session.user.id);
    return NextResponse.json(wallets);
  } catch (error) {
    console.error("Error listing wallets:", error);
    return NextResponse.json(
      { error: "Failed to list wallets" },
      { status: 500 }
    );
  }
};
