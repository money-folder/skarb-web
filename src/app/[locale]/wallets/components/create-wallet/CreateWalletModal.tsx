import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import { create } from "@/app/[locale]/wallets/actions";
import { DictionaryContext } from "@/shared/components/Dictionary";
import Overlay from "@/shared/components/overlay/Overlay";

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
    <div onClick={close}>
      <Overlay>
        <div
          className="w-96 rounded-xl bg-white p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-left text-lg font-bold">
            {d.modals.createWallet.title}
          </h3>
          <div className="mt-5">
            <WalletForm methods={methods} onSubmit={onSubmit} close={close} />
          </div>
        </div>
      </Overlay>
    </div>
  );
};

export default CreateWalletModal;
