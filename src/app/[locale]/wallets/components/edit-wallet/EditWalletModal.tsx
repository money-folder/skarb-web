import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

import { DictionaryContext } from "@/shared/components/Dictionary";
import Overlay from "@/shared/components/overlay/Overlay";

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
    <div onClick={close}>
      <Overlay>
        <div
          className="w-96 rounded-xl bg-white p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-left text-lg font-bold">
            {d.modals.editWallet.title}
          </h3>
          <div className="mt-5">
            <WalletForm
              methods={methods}
              onSubmit={onSubmit}
              close={close}
              disabledFields={{ currency: true }}
            />
          </div>
        </div>
      </Overlay>
    </div>
  );
};

export default EditWalletModal;
