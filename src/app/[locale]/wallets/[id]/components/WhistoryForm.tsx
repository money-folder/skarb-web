import { useContext } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DictionaryContext } from "@/shared/components/Dictionary";
import { getLocalISOString } from "@/shared/utils/utils";
import { WhistoryFormValues } from "../types";

interface Props {
  methods: UseFormReturn<WhistoryFormValues>;
  onSubmit: SubmitHandler<WhistoryFormValues>;
  onCancel: () => void;
}

const WhistoryForm = ({ methods, onSubmit, onCancel }: Props) => {
  const { d } = useContext(DictionaryContext);

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="mt-2 flex w-full flex-col items-start">
          <span>{d.modals.whistoryForm.dateLabel}</span>
          <input
            {...methods.register("date", { required: true, valueAsDate: true })}
            className="rounded-sm border-[1px] border-black px-2"
            type="datetime-local"
            defaultValue={getLocalISOString(new Date())}
          />
        </label>

        <label className="flex w-full flex-col items-start">
          <span>{d.modals.whistoryForm.amountLabel}</span>
          <input
            {...methods.register("amount", {
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
          <span>{d.modals.whistoryForm.commentLabel}</span>
          <textarea
            {...methods.register("comment", { required: false })}
            maxLength={255}
            className="w-full rounded-sm border-[1px] border-black px-2"
          />
        </label>
      </div>

      <div className="mt-10 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          {d.modals.whistoryForm.cancelLabel}
        </Button>
        <Button type="submit" variant="default">
          {d.modals.whistoryForm.submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default WhistoryForm;
