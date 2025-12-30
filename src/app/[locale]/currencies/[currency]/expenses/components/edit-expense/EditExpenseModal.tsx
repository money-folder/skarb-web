import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DictionaryContext } from "@/shared/components/Dictionary";
import { getLocalISOString } from "@/shared/utils/time-utils";

import { updateExpense } from "../../actions";
import { ClientExpenseDto, ExpenseFormValues } from "../../types";
import { expenseFormSchema } from "../../validation";
import ExpenseForm from "../create-expense/ExpenseForm";

interface Props {
  close: () => void;
  expense: ClientExpenseDto;
  currency: string;
  types?: string[] | null;
}

const EditExpenseModal = ({ close, expense, currency, types }: Props) => {
  const { d } = useContext(DictionaryContext);

  const methods = useForm<ExpenseFormValues, unknown, ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      moneyAmount: expense.moneyAmount,
      // @ts-expect-error -- the date should be set as string
      date: getLocalISOString(expense.date),
      type: expense.type,
      comment: expense.comment || "",
    },
  });

  const onSubmit = async ({
    moneyAmount,
    date,
    type,
    comment,
  }: ExpenseFormValues) => {
    await updateExpense({
      id: expense.id,
      moneyAmount,
      currency,
      date,
      type: type && type.trim(),
      comment: comment && comment.trim(),
    });
    close();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{d.modals.editExpense.title}</DialogTitle>
      </DialogHeader>
      <div className="mt-5">
        <ExpenseForm
          methods={methods}
          onSubmit={onSubmit}
          onCancel={close}
          types={types || []}
          defaultDate={expense.date}
        />
      </div>
    </>
  );
};

export default EditExpenseModal;
