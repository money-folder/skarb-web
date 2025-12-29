import { useContext } from "react";
import { useForm } from "react-hook-form";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DictionaryContext } from "@/shared/components/Dictionary";
import { zodResolver } from "@hookform/resolvers/zod";

import { exportAll } from "../actions";
import { ExportAllFormValues } from "../types";
import { downloadFile } from "../utils-fe";
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
      downloadFile(data.filename, data.b64);
      close();
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{d.modals.createWallet.title}</DialogTitle>
      </DialogHeader>
      <ExportAllForm methods={methods} onSubmit={onSubmit} onCancel={close} />
    </>
  );
};
