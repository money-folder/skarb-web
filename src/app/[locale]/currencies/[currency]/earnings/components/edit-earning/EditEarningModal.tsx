import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DictionaryContext } from "@/shared/components/Dictionary";
import { getLocalISOString } from "@/shared/utils/time-utils";

import { updateEarning } from "../../actions";
import { ClientEarningDto, EarningFormValues } from "../../types";
import { earningFormSchema } from "../../validation";
import EarningForm from "../create-earning/EarningForm";

interface Props {
  close: () => void;
  earning: ClientEarningDto;
  currency: string;
  types?: string[] | null;
}

const EditEarningModal = ({ close, earning, currency, types }: Props) => {
  const { d } = useContext(DictionaryContext);

  const methods = useForm<EarningFormValues, unknown, EarningFormValues>({
    resolver: zodResolver(earningFormSchema),
    defaultValues: {
      moneyAmount: earning.moneyAmount,
      // @ts-expect-error -- the date should be set as string
      date: getLocalISOString(earning.date),
      type: earning.type,
      comment: earning.comment || "",
    },
  });

  const onSubmit = async ({
    moneyAmount,
    date,
    type,
    comment,
  }: EarningFormValues) => {
    await updateEarning({
      id: earning.id,
      moneyAmount,
      currency,
      date,
      type: type && type.trim(),
      comment: comment && comment.trim(),
    });
    close();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{d.modals.editEarning.title}</DialogTitle>
      </DialogHeader>
      <div className="mt-5">
        <EarningForm
          methods={methods}
          onSubmit={onSubmit}
          onCancel={close}
          types={types || []}
          defaultDate={earning.date}
          dictionary={d.modals.earningForm}
        />
      </div>
    </>
  );
};

export default EditEarningModal;
