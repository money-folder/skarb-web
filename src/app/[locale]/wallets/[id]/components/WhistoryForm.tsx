import { useContext, useEffect, useRef } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

  const amountInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // An ugly fix to overwrite the radix dropdown that steals focus
    setTimeout(() => {
      amountInputRef.current?.focus();
    }, 75);
  }, []);

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <div className="flex w-full flex-col items-start gap-3">
          <Label htmlFor="whistoryDate">
            {d.modals.whistoryForm.dateLabel}
          </Label>
          <Input
            {...methods.register("date", { required: true, valueAsDate: true })}
            id="whistoryDate"
            className="rounded-sm border-[1px] border-black px-2"
            type="datetime-local"
            defaultValue={getLocalISOString(new Date())}
          />
        </div>
        <div className="flex w-full flex-col items-start gap-3">
          <Label htmlFor="whistoryAmount">
            {d.modals.whistoryForm.amountLabel}
          </Label>
          <Input
            {...methods.register("amount", {
              required: true,
              valueAsNumber: true,
            })}
            ref={amountInputRef}
            id="whistoryAmount"
            className="rounded-sm border-[1px] border-black px-2"
            type="number"
            step={0.01}
            autoFocus
          />
        </div>
        <div className="flex w-full flex-col items-start gap-3">
          <Label htmlFor="whistoryComment">
            {d.modals.whistoryForm.commentLabel}
          </Label>
          <Textarea
            {...methods.register("comment", { required: false })}
            id="whistoryComment"
            maxLength={255}
            className="w-full rounded-sm border-[1px] border-black px-2"
          />
        </div>
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
