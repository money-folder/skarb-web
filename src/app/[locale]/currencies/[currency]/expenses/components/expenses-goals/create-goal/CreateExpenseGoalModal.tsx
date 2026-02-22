import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DictionaryContext } from "@/shared/components/Dictionary";

import { createExpenseGoal } from "../../../actions";
import { ExpenseGoalFormValues } from "../../../types";
import { expenseGoalFormSchema } from "../../../validation";
import ExpenseGoalForm from "./ExpenseGoalForm";

interface Props {
  close: () => void;
  currency: string;
  types?: string[] | null;
  defaultDate?: Date;
}

const CreateExpenseGoalModal = ({
  close,
  currency,
  types,
  defaultDate,
}: Props) => {
  const { d } = useContext(DictionaryContext);

  const form = useForm({ resolver: zodResolver(expenseGoalFormSchema) });

  const onSubmit = async ({
    moneyAmount,
    startDate,
    endDate,
    type,
  }: ExpenseGoalFormValues) => {
    await createExpenseGoal({
      moneyAmount,
      startDate,
      endDate,
      type: type && type.trim(),
      currency,
    });
    close();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{d.modals.createExpenseGoal.title}</DialogTitle>
      </DialogHeader>
      <div className="mt-5">
        <ExpenseGoalForm
          form={form}
          onSubmit={onSubmit}
          onCancel={close}
          types={types || []}
          defaultDate={defaultDate}
        />
      </div>
    </>
  );
};

export default CreateExpenseGoalModal;
