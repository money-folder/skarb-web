import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

import { DictionaryContext } from "@/shared/components/Dictionary";
import Overlay from "@/shared/components/overlay/Overlay";
import { getLocalISOString, replacePlaceholders } from "@/shared/utils/utils";

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
    // @ts-ignore
    methods.setValue("date", getLocalISOString(whistory.date));
    methods.setValue("amount", whistory.moneyAmount);
    if (whistory.comment) {
      methods.setValue("comment", whistory.comment);
    }
  }, [methods, whistory]);

  const onSubmit = ({ amount, date, comment }: WhistoryFormValues) => {
    console.log({ data: { amount, date, comment } });
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
            {replacePlaceholders(d.modals.editWhistory.title, {
              walletName: "-",
            })}
          </h3>

          <WhistoryForm
            methods={methods}
            onSubmit={onSubmit}
            onCancel={close}
          />
        </div>
      </Overlay>
    </div>
  );
};

export default EditWhistoryModal;
