import { useContext } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DictionaryContext } from "@/shared/components/Dictionary";

import { ExportAllFormValues } from "../types";

interface Props {
  methods: UseFormReturn<ExportAllFormValues>;
  onSubmit: SubmitHandler<ExportAllFormValues>;
  onCancel: () => void;
}

export const ExportAllForm = ({ methods, onSubmit, onCancel }: Props) => {
  const { d } = useContext(DictionaryContext);

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <div className="mt-2 rounded-md bg-slate-100 p-2">
        <p>{d.modals.exportAllForm.outputFormat}</p>
        <div className="mt-1 flex flex-col">
          <label className="flex gap-2">
            <input
              {...methods.register("outputFormat")}
              type="radio"
              value="json"
            />
            <span>{d.modals.exportAllForm.outputFormatJson}</span>
          </label>
          <label className="flex gap-2">
            <input
              {...methods.register("outputFormat")}
              type="radio"
              value="sql"
            />
            <span>{d.modals.exportAllForm.outputFormatSql}</span>
          </label>
        </div>
      </div>
      <div className="mt-10 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          {d.modals.exportAllForm.cancelLabel}
        </Button>
        <Button type="submit">{d.modals.exportAllForm.submitLabel}</Button>
      </div>
    </form>
  );
};
