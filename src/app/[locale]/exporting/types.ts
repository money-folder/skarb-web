import { z } from "zod";

import { exportAllFormSchema } from "./validation";

export type ExportAllFormValues = z.infer<typeof exportAllFormSchema>;

export type ExportAllParams = {
  outputFormat: "json" | "sql";
};
