import { auth } from "@/auth";
import { ErrorCauses } from "@/shared/types/errors";

import * as exportingRepository from "./repository";
import { ExportAllParams } from "./types";
import { generateSQLDump } from "./utils-be";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCurrentUserAppData = async (params: ExportAllParams) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const appData = await exportingRepository.getUserAppData(session.user.id);
  const filename = `skarb-${new Date().valueOf()}.${params.outputFormat}`;
  if (params.outputFormat === "json") {
    const b64 = btoa(JSON.stringify(appData, null, 2));

    return {
      filename,
      b64,
    };
  }

  if (params.outputFormat === "sql") {
    const sql = generateSQLDump(appData!);
    const b64 = btoa(sql);

    return {
      filename,
      b64,
    };
  }

  return {
    filename: "",
    b64: "",
  };
};
