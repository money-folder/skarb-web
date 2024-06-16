import React from "react";

import { create } from "@/app/wallets/[id]/actions";
import Overlay from "@/components/overlay/Overlay";

import AddWhistoryForm from "./CreateWhistoryForm";

interface Props {
  walletId: string;
  close: () => void;
}

const CreateWhistoryModal = ({ walletId, close }: Props) => {
  const createWhistory = async (moneyAmount: number, date: number) => {
    await create({ walletId, moneyAmount, date });
  };

  return (
    <div onClick={close}>
      <Overlay>
        <div
          className="p-5 w-96 bg-white rounded-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-left font-bold text-lg">New Wallet Entry</h3>
          {/* TODO: maybe just remove the form component and put its content here? */}
          <AddWhistoryForm create={createWhistory} close={close} />
        </div>
      </Overlay>
    </div>
  );
};

export default CreateWhistoryModal;
