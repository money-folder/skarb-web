import React, { useContext } from "react";
import { FieldValues, useForm } from "react-hook-form";

// components
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { DictionaryContext } from "@/components/Dictionary";

interface Props {
  create: (name: string, currency: string) => void;
  close: () => void;
}

const CreateWalletForm = ({ create, close }: Props) => {
  const { d } = useContext(DictionaryContext);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (e: FieldValues) => {
    await create(e.name, e.currency);
    close();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="mt-2 w-full flex flex-col items-start">
          <span>{d.modals.createWallet.form.nameLabel}</span>
          <input
            {...register("name", { required: true, maxLength: 255 })}
            className="px-2 border-[1px] border-black rounded-sm"
            autoFocus
          />
        </label>

        <label className="mt-2 w-full flex flex-col items-start">
          <span>{d.modals.createWallet.form.currencyLabel}</span>
          <input
            {...register("currency", { required: true, maxLength: 63 })}
            className="px-2 border-[1px] border-black rounded-sm"
          />
        </label>
      </div>

      <div className="mt-10 flex justify-end gap-2">
        <SecondaryButton
          text={d.modals.createWallet.form.cancelLabel}
          onClick={close}
        />
        <PrimaryButton
          type="submit"
          text={d.modals.createWallet.form.submitLabel}
        />
      </div>
    </form>
  );
};

export default CreateWalletForm;
