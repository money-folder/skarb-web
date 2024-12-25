import { useContext } from "react";

import Overlay from "@/shared/components/overlay/Overlay";

import { create } from "@/app/[locale]/wallets/actions";

import CreateWalletForm from "./CreateWalletForm";
import { DictionaryContext } from "@/shared/components/Dictionary";

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
          className="p-5 w-96 bg-white rounded-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-left font-bold text-lg">
            {d.modals.createWallet.title}
          </h3>
          <CreateWalletForm create={createWallet} close={close} />
        </div>
      </Overlay>
    </div>
  );
};

export default CreateWalletModal;
