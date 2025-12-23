import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DictionaryContext } from "@/shared/components/Dictionary";

import { createExpense } from "../../actions";
import { ExpenseFormValues } from "../../types";
import { expenseFormSchema } from "../../validation";
import ExpenseForm from "./ExpenseForm";

interface Props {
  close: () => void;
  currency: string;
  types?: string[] | null;
  defaultDate?: Date;
}

const CreateExpenseModal = ({ close, currency, types, defaultDate }: Props) => {
  const { d } = useContext(DictionaryContext);

  const methods = useForm({ resolver: zodResolver(expenseFormSchema) });

  const onSubmit = async ({
    moneyAmount,
    date,
    type,
    comment,
  }: ExpenseFormValues) => {
    await createExpense({
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
        <DialogTitle>{d.modals.createExpense.title}</DialogTitle>
      </DialogHeader>
      <div className="mt-5">
        <ExpenseForm
          methods={methods}
          onSubmit={onSubmit}
          onCancel={close}
          types={types || []}
          defaultDate={defaultDate}
        />
      </div>
    </>
  );
};

export default CreateExpenseModal;
