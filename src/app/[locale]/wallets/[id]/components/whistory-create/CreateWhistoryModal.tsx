import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import { create } from "@/app/[locale]/wallets/[id]/actions";
import { DictionaryContext } from "@/shared/components/Dictionary";
import Overlay from "@/shared/components/overlay/Overlay";
import { replacePlaceholders } from "@/shared/utils/utils";

import { WhistoryFormValues } from "../../types";
import { whistoryFormSchema } from "../../validation";
import WhistoryForm from "../WhistoryForm";

interface Props {
  walletId: string;
  walletName: string;
  close: () => void;
}

const CreateWhistoryModal = ({ walletId, walletName, close }: Props) => {
  const { d } = useContext(DictionaryContext);

  const methods = useForm({ resolver: zodResolver(whistoryFormSchema) });

  const onSubmit = async ({ amount, date, comment }: WhistoryFormValues) => {
    await create({
      walletId,
      moneyAmount: amount,
      date: date.getTime(),
      comment: comment ? comment.trim() : undefined,
    });
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
            {replacePlaceholders(d.modals.createWhistory.title, { walletName })}
          </h3>
          <div className="mt-5">
            <WhistoryForm
              methods={methods}
              onSubmit={onSubmit}
              onCancel={close}
            />
          </div>
        </div>
      </Overlay>
    </div>
  );
};

export default CreateWhistoryModal;
