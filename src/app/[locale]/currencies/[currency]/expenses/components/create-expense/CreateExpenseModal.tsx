import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import { DictionaryContext } from "@/shared/components/Dictionary";
import Overlay from "@/shared/components/overlay/Overlay";

import { createExpense } from "../../actions";
import { ExpenseFormValues } from "../../types";
import { expenseFormSchema } from "../../validation";
import ExpenseForm from "./ExpenseForm";

interface Props {
  close: () => void;
  currency: string;
  types?: string[] | null;
}

const CreateExpenseModal = ({ close, currency, types }: Props) => {
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
    <div onClick={close}>
      <Overlay>
        <div
          className="w-196 rounded-xl bg-white p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-left text-lg font-bold">
            {d.modals.createExpense.title}
          </h3>
          <ExpenseForm
            methods={methods}
            onSubmit={onSubmit}
            onCancel={close}
            types={types}
          />
        </div>
      </Overlay>
    </div>
  );
};

export default CreateExpenseModal;
