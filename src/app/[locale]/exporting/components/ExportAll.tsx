"use client";

import { useContext, useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DictionaryContext } from "@/shared/components/Dictionary";

import { ExportAllModal } from "./ExportAllModal";

export const ExportAll = () => {
  const { d } = useContext(DictionaryContext);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-white hover:underline">
          {d.footer.exportAll}
        </button>
      </DialogTrigger>
      <DialogContent>
        <ExportAllModal close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
