import React, { useContext } from "react";
import { FieldValues, useForm } from "react-hook-form";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { DictionaryContext } from "@/components/Dictionary";

import { getLocalISOString } from "@/utils";

interface Props {
  create: (amount: number, ts: number, comment?: string) => void;
  close: () => void;
}

const AddWhistoryForm = ({ create, close }: Props) => {
  const { d } = useContext(DictionaryContext);

  const { register, handleSubmit } = useForm();

  const onSubmit = (e: FieldValues) => {
    const trimmedComment = e.comment ? e.comment.trim() : e.comment;
    create(e.amount, e.date.getTime(), trimmedComment);
    close();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="mt-2 w-full flex flex-col items-start">
          <span>{d.modals.createWhistory.form.dateLabel}</span>
          <input
            {...register("date", { required: true, valueAsDate: true })}
            className="px-2 border-[1px] border-black rounded-sm"
            type="datetime-local"
            defaultValue={getLocalISOString(new Date())}
          />
        </label>

        <label className="w-full flex flex-col items-start">
          <span>{d.modals.createWhistory.form.amountLabel}</span>
          <input
            {...register("amount", { required: true, valueAsNumber: true })}
            className="px-2 border-[1px] border-black rounded-sm"
            type="number"
            step={0.01}
            autoFocus
          />
        </label>

        <label className="w-full flex flex-col items-start">
          <span>{d.modals.createWhistory.form.commentLabel}</span>
          <textarea
            {...register("comment", { required: false })}
            maxLength={255}
            className="px-2 w-full border-[1px] border-black rounded-sm"
          />
        </label>
      </div>

      <div className="mt-10 flex justify-end gap-2">
        <SecondaryButton
          text={d.modals.createWhistory.form.cancelLabel}
          onClick={close}
        />
        <PrimaryButton
          type="submit"
          text={d.modals.createWhistory.form.submitLabel}
        />
      </div>
    </form>
  );
};

export default AddWhistoryForm;
