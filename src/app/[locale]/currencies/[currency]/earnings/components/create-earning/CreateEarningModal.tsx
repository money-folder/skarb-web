import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dictionary } from "@/dictionaries/locale";

import { createEarning } from "../../actions";
import { EarningFormValues } from "../../types";
import { earningFormSchema } from "../../validation";
import EarningForm from "./EarningForm";

interface Props {
  close: () => void;
  currency: string;
  types?: string[] | null;
  defaultDate?: Date;
  dictionary: {
    title: string;
    form: Dictionary["modals"]["earningForm"];
  };
}

const CreateEarningModal = ({
  close,
  currency,
  types,
  defaultDate,
  dictionary,
}: Props) => {
  const methods = useForm({ resolver: zodResolver(earningFormSchema) });

  const onSubmit = async ({
    moneyAmount,
    date,
    type,
    comment,
  }: EarningFormValues) => {
    await createEarning({
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
        <DialogTitle>{dictionary.title}</DialogTitle>
      </DialogHeader>
      <div className="mt-5">
        <EarningForm
          methods={methods}
          onSubmit={onSubmit}
          onCancel={close}
          types={types || []}
          defaultDate={defaultDate}
          dictionary={dictionary.form}
        />
      </div>
    </>
  );
};

export default CreateEarningModal;
