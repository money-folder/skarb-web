import { SubmitHandler, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dictionary } from "@/dictionaries/locale";
import { getLocalISOString } from "@/shared/utils/time-utils";

import { EarningFormValues } from "../../types";

interface Props {
  methods: UseFormReturn<EarningFormValues>;
  onSubmit: SubmitHandler<EarningFormValues>;
  onCancel: () => void;
  types: string[];
  defaultDate?: Date;
  dictionary: Dictionary["modals"]["earningForm"];
}

const EarningForm = ({
  methods,
  onSubmit,
  onCancel,
  types,
  defaultDate,
  dictionary,
}: Props) => {
  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <div className="flex w-full flex-col items-start gap-3">
          <Label htmlFor="earningDate">{dictionary.dateLabel}</Label>
          <Input
            {...methods.register("date", { required: true, valueAsDate: true })}
            id="earningDate"
            className="rounded-sm border-[1px] border-black px-2"
            type="datetime-local"
            defaultValue={getLocalISOString(defaultDate || new Date())}
          />
        </div>
        <div className="flex w-full flex-col items-start gap-3">
          <Label htmlFor="earningAmount">{dictionary.amountLabel}</Label>
          <Input
            {...methods.register("moneyAmount", {
              required: true,
              valueAsNumber: true,
            })}
            id="earningAmount"
            className="rounded-sm border-[1px] border-black px-2"
            type="number"
            step={0.01}
            autoFocus
          />
        </div>
        <div className="flex w-full flex-col items-start gap-3">
          <Label htmlFor="earningType">{dictionary.typeLabel}</Label>
          <Input
            {...methods.register("type", { required: true })}
            id="earningType"
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
          <Label htmlFor="earningComment">{dictionary.commentLabel}</Label>
          <Textarea
            {...methods.register("comment", { required: false })}
            id="earningComment"
            maxLength={255}
            className="w-full rounded-sm border-[1px] border-black px-2"
          />
        </div>
      </div>
      <div className="mt-10 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          {dictionary.cancelLabel}
        </Button>
        <Button type="submit">{dictionary.submitLabel}</Button>
      </div>
    </form>
  );
};

export default EarningForm;
