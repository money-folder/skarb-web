"use client";

import { CalendarIcon, Filter, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DictionaryContext } from "@/shared/components/Dictionary";
import { format } from "date-fns";

export default function WhistoryFilters() {
  const { d } = useContext(DictionaryContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  const fromTsParam = searchParams.get("fromTs");
  const toTsParam = searchParams.get("toTs");

  const fromDate = fromTsParam ? new Date(Number(fromTsParam)) : undefined;
  const toDate = toTsParam ? new Date(Number(toTsParam)) : undefined;

  const updateQueryParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFromDateSelect = (date: Date | undefined) => {
    if (date) {
      updateQueryParams("fromTs", date.getTime().toString());
    } else {
      updateQueryParams("fromTs", null);
    }
  };

  const handleToDateSelect = (date: Date | undefined) => {
    if (date) {
      updateQueryParams("toTs", date.getTime().toString());
    } else {
      updateQueryParams("toTs", null);
    }
  };

  const clearFromDate = () => {
    updateQueryParams("fromTs", null);
  };

  const clearToDate = () => {
    updateQueryParams("toTs", null);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 mt-1 h-4 w-4" />
              {d.whistoryPage.filters.filtersButton}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {d.whistoryPage.filters.fromDate}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate
                        ? format(fromDate, "PPP")
                        : d.whistoryPage.filters.pickADate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={handleFromDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {d.whistoryPage.filters.toDate}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !toDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate
                        ? format(toDate, "PPP")
                        : d.whistoryPage.filters.pickADate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={handleToDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Filter chips */}
        {fromDate && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1"
          >
            <span className="text-xs">
              {d.whistoryPage.filters.from} {format(fromDate, "PP")}
            </span>
            <button
              onClick={clearFromDate}
              className="ml-1 hover:text-destructive"
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {toDate && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1"
          >
            <span className="text-xs">
              {d.whistoryPage.filters.to} {format(toDate, "PP")}
            </span>
            <button
              onClick={clearToDate}
              className="ml-1 hover:text-destructive"
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>
    </div>
  );
}
