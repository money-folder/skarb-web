import React from "react";

import { create } from "@/actions/wallet-history";
import Overlay from "@/components/overlay/Overlay";

import AddWhistoryForm from "./CreateWhistoryForm";

interface Props {
  walletId: string;
  walletName: string;
  close: () => void;
}

const CreateWhistoryModal = ({ walletId, walletName, close }: Props) => {
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
          <h3 className="text-left font-bold text-lg">
            New {`"${walletName}"`} Entry
          </h3>
          <AddWhistoryForm create={createWhistory} close={close} />
        </div>
      </Overlay>
    </div>
  );
};

export default CreateWhistoryModal;
