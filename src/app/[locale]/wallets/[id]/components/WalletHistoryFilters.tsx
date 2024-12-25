"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Dictionary } from "@/shared/types/locale";
import { isValidDate } from "@/shared/utils/time-utils";
import { getLocalISOString } from "@/shared/utils/utils";

interface Props {
  d: Dictionary["whistoryPage"]["filters"];
}

const WalletHistoryFilters = ({ d }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { register, watch, reset } = useForm();

  const whistoryFromParam = searchParams.get("whistoryFrom")
    ? getLocalISOString(new Date(+searchParams.get("whistoryFrom")!))
    : undefined;

  const whistoryToParam = searchParams.get("whistoryTo")
    ? getLocalISOString(new Date(+searchParams.get("whistoryTo")!))
    : undefined;

  useEffect(() => {
    watch((data) => {
      const params = new URLSearchParams(searchParams);
      if (data.whistoryFrom && isValidDate(data.whistoryFrom)) {
        params.set("whistoryFrom", data.whistoryFrom.getTime());
      } else {
        params.delete("whistoryFrom");
      }

      if (data.whistoryTo && isValidDate(data.whistoryTo)) {
        params.set("whistoryTo", data.whistoryTo.getTime());
      } else {
        params.delete("whistoryTo");
      }

      replace(`${pathname}?${params.toString()}`);
    });
  }, [watch, searchParams, replace, pathname]);

  return (
    <form className="w-full flex flex-col justify-start items-start gap-2">
      <div className="flex gap-5">
        <label className="flex gap-3">
          <span>{d.form.fromLabel}</span>
          <input
            {...register("whistoryFrom", {
              required: false,
              valueAsDate: true,
            })}
            type="datetime-local"
            name="whistoryFrom"
            {...(whistoryFromParam ? { defaultValue: whistoryFromParam } : {})}
          />
        </label>

        <label className="flex gap-3">
          <span>{d.form.toLabel}</span>
          <input
            {...register("whistoryTo", { required: false, valueAsDate: true })}
            type="datetime-local"
            name="whistoryTo"
            {...(whistoryToParam ? { defaultValue: whistoryToParam } : {})}
          />
        </label>
      </div>

      <button className="hover:underline" type="reset" onClick={reset}>
        {d.form.resetLabel}
      </button>
    </form>
  );
};

export default WalletHistoryFilters;
