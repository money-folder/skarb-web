"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

import { DictionaryContext } from "@/shared/components/Dictionary";
import { isValidDate } from "@/shared/utils/time-utils";
import { getLocalISOString } from "@/shared/utils/utils";

const ExpensesComposedFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { register, watch } = useForm();

  const { d } = useContext(DictionaryContext);

  const dateFromParam = searchParams.get("dateFrom")
    ? getLocalISOString(new Date(+searchParams.get("dateFrom")!))
    : undefined;

  const dateToParam = searchParams.get("dateTo")
    ? getLocalISOString(new Date(+searchParams.get("dateTo")!))
    : undefined;

  useEffect(() => {
    watch((data) => {
      const params = new URLSearchParams(searchParams);
      if (data.dateFrom && isValidDate(data.dateFrom)) {
        params.set("dateFrom", data.dateFrom.getTime());
      } else {
        params.delete("dateFrom");
      }

      if (data.dateTo && isValidDate(data.dateTo)) {
        params.set("dateTo", data.dateTo.getTime());
      } else {
        params.delete("dateTo");
      }

      replace(`${pathname}?${params.toString()}`);
    });
  }, [watch, searchParams, replace, pathname]);

  return (
    <form>
      <div className="flex gap-5">
        <label className="flex gap-3">
          <span>{d.currencyPage.filters.form.fromLabel}</span>
          <input
            {...register("dateFrom", {
              required: false,
              valueAsDate: true,
            })}
            type="datetime-local"
            name="dateFrom"
            {...(dateFromParam ? { defaultValue: dateFromParam } : {})}
          />
        </label>
        <label className="flex gap-3">
          <span>{d.currencyPage.filters.form.toLabel}</span>
          <input
            {...register("dateTo", { required: false, valueAsDate: true })}
            type="datetime-local"
            name="dateTo"
            {...(dateToParam ? { defaultValue: dateToParam } : {})}
          />
        </label>
      </div>
    </form>
  );
};

export default ExpensesComposedFilters;
