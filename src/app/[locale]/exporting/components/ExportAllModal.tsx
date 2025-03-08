import { useContext } from "react";
import { useForm } from "react-hook-form";

import { DictionaryContext } from "@/shared/components/Dictionary";
import Overlay from "@/shared/components/overlay/Overlay";
import { zodResolver } from "@hookform/resolvers/zod";

import { exportAll } from "../actions";
import { ExportAllFormValues } from "../types";
import { downloadJSON } from "../utils";
import { exportAllFormSchema } from "../validation";
import { ExportAllForm } from "./ExportAllForm";

interface Props {
  close: () => void;
}

export const ExportAllModal = ({ close }: Props) => {
  const { d } = useContext(DictionaryContext);

  const methods = useForm({
    resolver: zodResolver(exportAllFormSchema),
    defaultValues: {
      outputFormat: "json" as const,
    },
  });

  const onSubmit = async (params: ExportAllFormValues) => {
    const { data } = await exportAll(params);
    if (data) {
      downloadJSON(data);
    }
  };

  return (
    <div onClick={close}>
      <Overlay>
        <div
          className="w-96 rounded-xl bg-white p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-left text-lg font-bold">
            {d.modals.createWallet.title}
          </h3>
          <ExportAllForm
            methods={methods}
            onSubmit={onSubmit}
            onCancel={close}
          />
        </div>
      </Overlay>
    </div>
  );
};
