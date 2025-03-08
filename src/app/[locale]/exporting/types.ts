import { z } from "zod";

import * as exportingRepository from "./repository";
import { exportAllFormSchema } from "./validation";

export type ExportAllFormValues = z.infer<typeof exportAllFormSchema>;

export type ExportAllParams = {
  outputFormat: "json" | "sql";
};

export type AppData = NonNullable<
  Awaited<ReturnType<typeof exportingRepository.getUserAppData>>
>;
