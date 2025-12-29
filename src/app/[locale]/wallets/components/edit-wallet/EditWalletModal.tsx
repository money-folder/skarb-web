import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DictionaryContext } from "@/shared/components/Dictionary";

import { update } from "../../actions";
import { ClientWalletDto, WalletFormValues } from "../../types";
import { walletFormSchema } from "../../validation";
import WalletForm from "../WalletForm";

interface Props {
  wallet: ClientWalletDto;
  close: () => void;
}

const EditWalletModal = ({ wallet, close }: Props) => {
  const { d } = useContext(DictionaryContext);

  const methods = useForm({ resolver: zodResolver(walletFormSchema) });

  useEffect(() => {
    methods.setValue("name", wallet.name);
    methods.setValue("currency", wallet.currency);
  }, [methods, wallet]);

  const onSubmit = async ({ name }: WalletFormValues) => {
    await update({ id: wallet.id, data: { name } });
    close();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{d.modals.editWallet.title}</DialogTitle>
      </DialogHeader>
      <WalletForm
        methods={methods}
        onSubmit={onSubmit}
        close={close}
        disabledFields={{ currency: true }}
      />
    </>
  );
};

export default EditWalletModal;
