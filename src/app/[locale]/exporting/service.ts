import { auth } from "@/auth";
import { ErrorCauses } from "@/shared/types/errors";

import * as exportingRepository from "./repository";
import { ExportAllParams } from "./types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCurrentUserAppData = async (params: ExportAllParams) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const appData = await exportingRepository.getUserAppData(session.user.id);
  const b64 = btoa(JSON.stringify(appData, null, 2));
  const filename = `skarb-${new Date().valueOf()}.${params.outputFormat}`;

  return {
    filename,
    b64,
  };
};
