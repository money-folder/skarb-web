import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import * as walletsRepository from "@/repositories/wallets";

import { createWalletSchema } from "./validation";

export const POST = async (request: NextRequest) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = createWalletSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const result = await walletsRepository.create({
      name: validationResult.data.name,
      currency: validationResult.data.currency,
      ownerId: session.user.id,
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error creating table entry:", error);
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
};
