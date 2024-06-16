import Overlay from "@/components/overlay/Overlay";
import { create } from "@/app/wallets/actions";

import CreateWalletForm from "./CreateWalletForm";

interface Props {
  close: () => void;
}

const CreateWalletModal = ({ close }: Props) => {
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
          <h3 className="text-left font-bold text-lg">Create Wallet</h3>
          <CreateWalletForm create={createWallet} close={close} />
        </div>
      </Overlay>
    </div>
  );
};

export default CreateWalletModal;
