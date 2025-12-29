import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import { create } from "@/app/[locale]/wallets/actions";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DictionaryContext } from "@/shared/components/Dictionary";

import { WalletFormValues } from "../../types";
import { walletFormSchema } from "../../validation";
import WalletForm from "../WalletForm";

interface Props {
  close: () => void;
}

const CreateWalletModal = ({ close }: Props) => {
  const { d } = useContext(DictionaryContext);

  const methods = useForm({ resolver: zodResolver(walletFormSchema) });

  const onSubmit = async ({ name, currency }: WalletFormValues) => {
    await create({ name, currency });
    close();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{d.modals.createWallet.title}</DialogTitle>
      </DialogHeader>
      <div className="mt-5">
        <WalletForm methods={methods} onSubmit={onSubmit} close={close} />
      </div>
    </>
  );
};

export default CreateWalletModal;
