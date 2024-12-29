import { useContext } from "react";
import { FieldValues, useForm } from "react-hook-form";

import PrimaryButton from "@/shared/components/buttons/PrimaryButton";
import SecondaryButton from "@/shared/components/buttons/SecondaryButton";
import { DictionaryContext } from "@/shared/components/Dictionary";

import { getLocalISOString } from "@/shared/utils/utils";

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
        <label className="mt-2 flex w-full flex-col items-start">
          <span>{d.modals.createWhistory.form.dateLabel}</span>
          <input
            {...register("date", { required: true, valueAsDate: true })}
            className="rounded-sm border-[1px] border-black px-2"
            type="datetime-local"
            defaultValue={getLocalISOString(new Date())}
          />
        </label>

        <label className="flex w-full flex-col items-start">
          <span>{d.modals.createWhistory.form.amountLabel}</span>
          <input
            {...register("amount", { required: true, valueAsNumber: true })}
            className="rounded-sm border-[1px] border-black px-2"
            type="number"
            step={0.01}
            autoFocus
          />
        </label>

        <label className="flex w-full flex-col items-start">
          <span>{d.modals.createWhistory.form.commentLabel}</span>
          <textarea
            {...register("comment", { required: false })}
            maxLength={255}
            className="w-full rounded-sm border-[1px] border-black px-2"
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
