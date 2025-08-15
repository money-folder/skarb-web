import { useContext } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DictionaryContext } from "@/shared/components/Dictionary";

import { WalletFormValues } from "../types";

interface Props {
  methods: UseFormReturn<WalletFormValues>;
  onSubmit: SubmitHandler<WalletFormValues>;
  close: () => void;
  disabledFields?: Partial<{ [key in keyof WalletFormValues]: true }>;
}

const WalletForm = ({
  methods,
  onSubmit,
  close,
  disabledFields = {},
}: Props) => {
  const { d } = useContext(DictionaryContext);

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="mt-2 flex w-full flex-col items-start">
          <span>{d.modals.walletForm.nameLabel}</span>
          <input
            {...methods.register("name", { disabled: disabledFields["name"] })}
            className="rounded-sm border-[1px] border-black px-2"
            autoFocus
          />
        </label>

        <label className="mt-2 flex w-full flex-col items-start">
          <span>{d.modals.walletForm.currencyLabel}</span>
          <input
            {...methods.register("currency", {
              disabled: disabledFields["currency"],
            })}
            className="rounded-sm border-[1px] border-black px-2 disabled:opacity-25"
          />
        </label>
      </div>

      <div className="mt-10 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={close}>
          {d.modals.walletForm.cancelLabel}
        </Button>
        <Button type="submit">{d.modals.walletForm.submitLabel}</Button>
      </div>
    </form>
  );
};

export default WalletForm;
