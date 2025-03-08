import { z } from "zod";

export const exportAllFormSchema = z.object({
  outputFormat: z.enum(["json", "sql"]),
});
