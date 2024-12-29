import { useContext } from "react";
import { FieldValues, useForm } from "react-hook-form";

// components
import PrimaryButton from "@/shared/components/buttons/PrimaryButton";
import SecondaryButton from "@/shared/components/buttons/SecondaryButton";
import { DictionaryContext } from "@/shared/components/Dictionary";

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
        <label className="mt-2 flex w-full flex-col items-start">
          <span>{d.modals.createWallet.form.nameLabel}</span>
          <input
            {...register("name", { required: true, maxLength: 255 })}
            className="rounded-sm border-[1px] border-black px-2"
            autoFocus
          />
        </label>

        <label className="mt-2 flex w-full flex-col items-start">
          <span>{d.modals.createWallet.form.currencyLabel}</span>
          <input
            {...register("currency", { required: true, maxLength: 63 })}
            className="rounded-sm border-[1px] border-black px-2"
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
