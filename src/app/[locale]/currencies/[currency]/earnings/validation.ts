import { z } from "zod";

export const createEarningRequestSchema = z.object({
  moneyAmount: z.number(),
  date: z.date(),
  type: z.string(),
  currency: z.string(),
  comment: z.string().optional(),
});

export const updateEarningRequestSchema = z.object({
  id: z.string(),
  moneyAmount: z.number(),
  date: z.date(),
  type: z.string(),
  currency: z.string(),
  comment: z.string().optional(),
});

export const earningFormSchema = z.object({
  moneyAmount: z.number(),
  date: z.date(),
  type: z.string().trim().min(1).max(255),
  comment: z.string().optional(),
});
