"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import TrashIcon from "@/assets/trash.svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dictionary } from "@/dictionaries/locale";
import { formatDateOnly } from "@/shared/utils/time-utils";

import { createBatchExpenses, fetchExpensesByDate } from "../../../actions";
import { ClientExpenseDto } from "../../../types";
import { dayExpenseFormSchema } from "../../../validation";

interface Props {
  dictionary: Dictionary["currencyPage"]["expensesContainer"]["expenses"];
  currency: string;
  date: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  types: string[];
}

type FormValues = z.infer<typeof dayExpenseFormSchema>;

export function ExpensesDayDialog({
  dictionary,
  currency,
  date,
  open,
  onOpenChange,
  types,
}: Props) {
  const [expenses, setExpenses] = useState<ClientExpenseDto[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(dayExpenseFormSchema),
    defaultValues: {
      expenses: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "expenses",
    control: form.control,
  });

  useEffect(() => {
    if (open) {
      const loadExpenses = async () => {
        const result = await fetchExpensesByDate(currency, date);
        if (result.success && result.data) {
          setExpenses(result.data);
        }
      };
      loadExpenses();
    }
  }, [open, currency, date]);

  const addNewExpenseRow = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    append({ type: "", comment: "" });
  };

  const onSubmit = async (values: FormValues) => {
    const expensesToCreate = values.expenses.map((expense) => ({
      ...expense,
      date,
      currency,
    }));

    const result = await createBatchExpenses(expensesToCreate);
    if (result.success) {
      form.reset({ expenses: [] });
      const loadResult = await fetchExpensesByDate(currency, date);
      if (loadResult.success && loadResult.data) {
        setExpenses(loadResult.data);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {dictionary.dayDialog.title} {date.toLocaleDateString()}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Existing expenses table */}
          {expenses.length > 0 && (
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{dictionary.table.type}</TableHead>
                    <TableHead className="text-right">
                      {dictionary.table.amount}
                    </TableHead>
                    <TableHead>{dictionary.table.comment}</TableHead>
                    <TableHead>{dictionary.table.date}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.type}</TableCell>
                      <TableCell className="text-right">
                        {expense.moneyAmount}
                      </TableCell>
                      <TableCell>{expense.comment}</TableCell>
                      <TableCell>{formatDateOnly(expense.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* New expenses form */}
          <div className="mt-6">
            <Button type="button" onClick={addNewExpenseRow} variant="outline">
              {dictionary.dayDialog.addNewExpense}
            </Button>

            {fields.length > 0 && (
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{dictionary.table.type}</TableHead>
                      <TableHead className="text-right">
                        {dictionary.table.amount}
                      </TableHead>
                      <TableHead>{dictionary.table.comment}</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Input
                            {...form.register(`expenses.${index}.type`)}
                            list="types"
                            className={`w-full ${
                              form.formState.errors.expenses?.[index]?.type
                                ? "border-red-500"
                                : ""
                            }`}
                            maxLength={255}
                          />
                          <datalist id="types">
                            {types.map((type) => (
                              <option key={type} value={type} />
                            ))}
                          </datalist>
                          {form.formState.errors.expenses?.[index]?.type && (
                            <div className="absolute mt-1 text-xs text-red-500">
                              {
                                form.formState.errors.expenses[index]?.type
                                  ?.message
                              }
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            {...form.register(`expenses.${index}.moneyAmount`, {
                              valueAsNumber: true,
                            })}
                            type="number"
                            step="0.01"
                            className={`w-full text-right ${
                              form.formState.errors.expenses?.[index]
                                ?.moneyAmount
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                          {form.formState.errors.expenses?.[index]
                            ?.moneyAmount && (
                            <div className="absolute mt-1 text-xs text-red-500">
                              {
                                form.formState.errors.expenses[index]
                                  ?.moneyAmount?.message
                              }
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Textarea
                            {...form.register(`expenses.${index}.comment`)}
                            className="w-full"
                            maxLength={255}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="h-8 px-2"
                          >
                            <Image src={TrashIcon} alt="trash" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 flex justify-end">
                  <Button type="submit">{dictionary.dayDialog.submit}</Button>
                </div>
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
