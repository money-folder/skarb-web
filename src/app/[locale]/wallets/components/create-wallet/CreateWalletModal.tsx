import { useContext } from "react";

import Overlay from "@/shared/components/overlay/Overlay";

import { create } from "@/app/[locale]/wallets/actions";

import { DictionaryContext } from "@/shared/components/Dictionary";
import CreateWalletForm from "./CreateWalletForm";

interface Props {
  close: () => void;
}

const CreateWalletModal = ({ close }: Props) => {
  const { d } = useContext(DictionaryContext);

  const createWallet = async (name: string, currency: string) => {
    await create({ name, currency });
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
          <CreateWalletForm create={createWallet} close={close} />
        </div>
      </Overlay>
    </div>
  );
};

export default CreateWalletModal;
