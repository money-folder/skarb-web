import { useContext } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

import PrimaryButton from "@/shared/components/buttons/PrimaryButton";
import SecondaryButton from "@/shared/components/buttons/SecondaryButton";
import { DictionaryContext } from "@/shared/components/Dictionary";
import { getLocalISOString } from "@/shared/utils/utils";
import { ExpenseFormValues } from "../../types";

interface Props {
  methods: UseFormReturn<ExpenseFormValues>;
  onSubmit: SubmitHandler<ExpenseFormValues>;
  onCancel: () => void;
  types: string[];
}

const ExpenseForm = ({ methods, onSubmit, onCancel, types }: Props) => {
  const { d } = useContext(DictionaryContext);

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="mt-2 flex w-full flex-col items-start">
          <span>{d.modals.expenseForm.dateLabel}</span>
          <input
            {...methods.register("date", { required: true, valueAsDate: true })}
            className="rounded-sm border-[1px] border-black px-2"
            type="datetime-local"
            defaultValue={getLocalISOString(new Date())}
          />
        </label>

        <label className="flex w-full flex-col items-start">
          <span>{d.modals.expenseForm.amountLabel}</span>
          <input
            {...methods.register("moneyAmount", {
              required: true,
              valueAsNumber: true,
            })}
            className="rounded-sm border-[1px] border-black px-2"
            type="number"
            step={0.01}
            autoFocus
          />
        </label>

        <label className="flex w-full flex-col items-start">
          <span>{d.modals.expenseForm.typeLabel}</span>
          <input
            {...methods.register("type", {
              required: true,
            })}
            className="rounded-sm border-[1px] border-black px-2"
            type="text"
            maxLength={255}
            list="types"
          />
          <datalist
            className="rounded-sm border-[1px] border-black px-2"
            id="types"
          >
            {types.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </datalist>
        </label>

        <label className="flex w-full flex-col items-start">
          <span>{d.modals.expenseForm.commentLabel}</span>
          <textarea
            {...methods.register("comment", { required: false })}
            maxLength={255}
            className="w-full rounded-sm border-[1px] border-black px-2"
          />
        </label>
      </div>

      <div className="mt-10 flex justify-end gap-2">
        <SecondaryButton
          text={d.modals.expenseForm.cancelLabel}
          onClick={onCancel}
        />
        <PrimaryButton type="submit" text={d.modals.expenseForm.submitLabel} />
      </div>
    </form>
  );
};

export default ExpenseForm;
