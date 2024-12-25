import { useContext } from "react";

import { create } from "@/app/[locale]/wallets/[id]/actions";
import { DictionaryContext } from "@/shared/components/Dictionary";
import Overlay from "@/shared/components/overlay/Overlay";

import { replacePlaceholders } from "@/shared/utils/utils";
import AddWhistoryForm from "./CreateWhistoryForm";

interface Props {
  walletId: string;
  walletName: string;
  close: () => void;
}

const CreateWhistoryModal = ({ walletId, walletName, close }: Props) => {
  const { d } = useContext(DictionaryContext);

  const createWhistory = async (
    moneyAmount: number,
    date: number,
    comment?: string,
  ) => {
    await create({ walletId, moneyAmount, date, comment });
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
