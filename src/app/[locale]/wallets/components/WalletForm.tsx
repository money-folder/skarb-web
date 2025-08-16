import { useContext } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DictionaryContext } from "@/shared/components/Dictionary";

import { Label } from "@/components/ui/label";
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
      <div className="space-y-5">
        <div className="flex w-full flex-col items-start gap-3">
          <Label htmlFor="walletName">{d.modals.walletForm.nameLabel}</Label>
          <Input
            {...methods.register("name", { disabled: disabledFields["name"] })}
            id="walletName"
            autoFocus
          />
        </div>
        <div className="mt-2 flex w-full flex-col items-start gap-3">
          <Label htmlFor="walletCurrency">
            {d.modals.walletForm.currencyLabel}
          </Label>
          <Input
            {...methods.register("currency", {
              disabled: disabledFields["currency"],
            })}
            id="walletCurrency"
            className="disabled:opacity-25"
          />
        </div>
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
