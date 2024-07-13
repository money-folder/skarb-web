"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { getLocalISOString } from "@/utils";
import { isValidDate } from "@/utils/time-utils";

const WalletHistoryFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { register, watch } = useForm();

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
    <form className="w-full flex justify-start gap-5">
      <label className="flex gap-3">
        <span>From</span>
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
        <span>To</span>
        <input
          {...register("whistoryTo", { required: false, valueAsDate: true })}
          type="datetime-local"
          name="whistoryTo"
          {...(whistoryToParam ? { defaultValue: whistoryToParam } : {})}
        />
      </label>
    </form>
  );
};

export default WalletHistoryFilters;
