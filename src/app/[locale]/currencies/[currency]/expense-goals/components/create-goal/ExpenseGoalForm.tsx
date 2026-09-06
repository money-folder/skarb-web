import { useContext } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DictionaryContext } from "@/shared/components/Dictionary";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ExpenseGoalFormValues } from "../../types";

interface Props {
  form: UseFormReturn<ExpenseGoalFormValues>;
  onSubmit: SubmitHandler<ExpenseGoalFormValues>;
  onCancel: () => void;
  types: string[];
  defaultDate?: Date;
}

const ExpenseGoalForm = ({ form, onSubmit, onCancel, types }: Props) => {
  const { d } = useContext(DictionaryContext);

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <div className="flex w-full flex-col items-start gap-3">
          <Label htmlFor="dateRange">
            {d.modals.expenseGoalForm.dateRange}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="dateRange"
                className="justify-start px-2.5 font-normal"
              >
                <CalendarIcon />
                {startDate ? (
                  endDate ? (
                    <>
                      {format(startDate, "LLL dd, y")}
                      {" - "}
                      {format(endDate, "LLL dd, y")}
                    </>
                  ) : (
                    format(startDate, "LLL dd, y")
                  )
                ) : (
                  <span>{d.modals.expenseGoalForm.dateRange}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={startDate}
                selected={{ from: startDate, to: endDate }}
                onSelect={(range) => {
                  form.setValue("startDate", range?.from ?? new Date());
                  form.setValue("endDate", range?.to ?? new Date());
                }}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex w-full flex-col items-start gap-3">
          <Label htmlFor="expenseAmount">
            {d.modals.expenseGoalForm.amountLabel}
          </Label>
          <Input
            {...form.register("moneyAmount", {
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
          <Label htmlFor="expenseType">
            {d.modals.expenseGoalForm.typeLabel}
          </Label>
          <Input
            {...form.register("type", { required: true })}
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
      </div>
      <div className="mt-10 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          {d.modals.expenseGoalForm.cancelLabel}
        </Button>
        <Button type="submit">{d.modals.expenseGoalForm.submitLabel}</Button>
      </div>
    </form>
  );
};

export default ExpenseGoalForm;
