import { z } from "zod";

import {
  createEarningRequestSchema,
  earningFormSchema,
  updateEarningRequestSchema,
} from "./validation";

export type EarningDb = {
  id: string;
  date: Date;
  moneyAmount: number;
  currency: string;
  type: string;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  ownerId: string;
};

export type ClientEarningDto = EarningDb;

export type CreateEarningDto = {
  moneyAmount: number;
  date: Date;
  type: string;
  ownerId: string;
  currency: string;
  comment?: string;
};

export type UpdateEarningDto = {
  id: string;
  moneyAmount: number;
  date: Date;
  type: string;
  currency: string;
  comment?: string;
};

export type CreateEarningRequestDto = z.infer<
  typeof createEarningRequestSchema
>;

export type UpdateEarningRequestDto = z.infer<
  typeof updateEarningRequestSchema
>;

export type EarningFormValues = z.infer<typeof earningFormSchema>;

export type FetchEarningsParams = {
  fromTs?: number;
  toTs?: number;
  types?: string[];
  comment?: string;
  page?: number;
  pageSize?: number;
};

export type FetchEarningsSumParams = {
  fromTs?: number;
  toTs?: number;
};
