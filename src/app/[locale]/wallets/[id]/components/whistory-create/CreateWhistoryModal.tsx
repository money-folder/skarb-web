import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import { create } from "@/app/[locale]/wallets/[id]/actions";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DictionaryContext } from "@/shared/components/Dictionary";
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
    <>
      <DialogHeader>
        <DialogTitle>
          {replacePlaceholders(d.modals.createWhistory.title, { walletName })}
        </DialogTitle>
      </DialogHeader>
      <WhistoryForm methods={methods} onSubmit={onSubmit} onCancel={close} />
    </>
  );
};

export default CreateWhistoryModal;
