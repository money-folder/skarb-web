import { useContext } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DictionaryContext } from "@/shared/components/Dictionary";
import { getLocalISOString } from "@/shared/utils/utils";

import { ExpenseFormValues } from "../../types";

interface Props {
  methods: UseFormReturn<ExpenseFormValues>;
  onSubmit: SubmitHandler<ExpenseFormValues>;
  onCancel: () => void;
  types: string[];
  defaultDate?: Date;
}

const ExpenseForm = ({
  methods,
  onSubmit,
  onCancel,
  types,
  defaultDate,
}: Props) => {
  const { d } = useContext(DictionaryContext);

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <div className="flex w-full flex-col items-start gap-3">
          <Label htmlFor="expenseDate">{d.modals.expenseForm.dateLabel}</Label>
          <Input
            {...methods.register("date", { required: true, valueAsDate: true })}
            id="expenseDate"
            className="rounded-sm border-[1px] border-black px-2"
            type="datetime-local"
            defaultValue={getLocalISOString(defaultDate || new Date())}
          />
        </div>
        <div className="flex w-full flex-col items-start gap-3">
          <Label htmlFor="expenseAmount">
            {d.modals.expenseForm.amountLabel}
          </Label>
          <Input
            {...methods.register("moneyAmount", {
              required: true,
              valueAsNumber: true,
            })}
            id="expenseAmount"
            className="rounded-sm border-[1px] border-black px-2"
            type="number"
            step={0.01}
            autoFocus
          />
        </div>
        <div className="flex w-full flex-col items-start gap-3">
          <Label htmlFor="expenseType">{d.modals.expenseForm.typeLabel}</Label>
          <Input
            {...methods.register("type", {
              required: true,
            })}
            id="expenseType"
            className="rounded-sm border-[1px] border-black px-2"
            type="text"
            maxLength={255}
            list="types"
          />
          <datalist
            className="w-full rounded-sm border-[1px] border-black px-2"
            id="types"
          >
            {types.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </datalist>
        </div>
        <div className="flex w-full flex-col items-start gap-3">
          <Label htmlFor="expenseComment">
            {d.modals.expenseForm.commentLabel}
          </Label>
          <Textarea
            {...methods.register("comment", { required: false })}
            id="expenseComment"
            maxLength={255}
            className="w-full rounded-sm border-[1px] border-black px-2"
          />
        </div>
      </div>
      <div className="mt-10 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          {d.modals.expenseForm.cancelLabel}
        </Button>
        <Button type="submit">{d.modals.expenseForm.submitLabel}</Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
