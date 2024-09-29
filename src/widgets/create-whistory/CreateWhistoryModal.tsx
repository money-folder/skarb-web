import React, { useContext } from "react";

import { create } from "@/actions/wallet-history";
import Overlay from "@/components/overlay/Overlay";
import { DictionaryContext } from "@/components/Dictionary";

import AddWhistoryForm from "./CreateWhistoryForm";
import { replacePlaceholders } from "@/utils";

interface Props {
  walletId: string;
  walletName: string;
  close: () => void;
}

const CreateWhistoryModal = ({ walletId, walletName, close }: Props) => {
  const { d } = useContext(DictionaryContext);

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
            {replacePlaceholders(d.modals.createWhistory.title, { walletName })}
          </h3>

          <AddWhistoryForm create={createWhistory} close={close} />
        </div>
      </Overlay>
    </div>
  );
};

export default CreateWhistoryModal;
