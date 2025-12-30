import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

import { DictionaryContext } from "@/shared/components/Dictionary";
import { getLocalISOString } from "@/shared/utils/time-utils";
import { replacePlaceholders } from "@/shared/utils/utils";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { update } from "../../actions";
import { ClientWhistoryDto, WhistoryFormValues } from "../../types";
import { whistoryFormSchema } from "../../validation";
import WhistoryForm from "../WhistoryForm";

interface Props {
  whistory: ClientWhistoryDto;
  close: () => void;
}

const EditWhistoryModal = ({ whistory, close }: Props) => {
  const { d } = useContext(DictionaryContext);

  const methods = useForm({ resolver: zodResolver(whistoryFormSchema) });

  useEffect(() => {
    // @ts-expect-error -- the date should be set as string
    methods.setValue("date", getLocalISOString(whistory.date));
    methods.setValue("amount", whistory.moneyAmount);
    if (whistory.comment) {
      methods.setValue("comment", whistory.comment);
    }
  }, [methods, whistory]);

  const onSubmit = async ({ amount, date, comment }: WhistoryFormValues) => {
    await update({
      id: whistory.id,
      walletId: whistory.walletId,
      data: { moneyAmount: amount, date: date.getTime(), comment },
    });
    close();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-left text-lg font-bold">
          {replacePlaceholders(d.modals.editWhistory.title, {
            walletName: "-",
          })}
        </DialogTitle>
      </DialogHeader>
      <div className="mt-5">
        <WhistoryForm methods={methods} onSubmit={onSubmit} onCancel={close} />
      </div>
    </>
  );
};

export default EditWhistoryModal;
