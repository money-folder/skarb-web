"use client";

import { format } from "date-fns";
import { CalendarIcon, Filter, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dictionary } from "@/dictionaries/locale";
import { cn } from "@/lib/utils";
import { replacePlaceholders } from "@/shared/utils/utils";

interface Props {
  dictionary: Dictionary["currencyPage"]["historyFilters"];
}

export default function HistoryFilters({ dictionary }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  const fromTsParam = searchParams.get("fromTs");
  const toTsParam = searchParams.get("toTs");
  const dayStepParam = searchParams.get("dayStep");

  const fromDate = fromTsParam ? new Date(Number(fromTsParam)) : undefined;
  const toDate = toTsParam ? new Date(Number(toTsParam)) : undefined;
  const dayStep = dayStepParam ? Number(dayStepParam) : 1;

  // Local state for pending filter changes
  const [localFromDate, setLocalFromDate] = useState<Date | undefined>(
    fromDate,
  );
  const [localToDate, setLocalToDate] = useState<Date | undefined>(toDate);
  const [localDayStep, setLocalDayStep] = useState<number>(dayStep);

  // Sync local state with URL params when they change
  useEffect(() => {
    setLocalFromDate(fromDate);
    setLocalToDate(toDate);
    setLocalDayStep(dayStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromTsParam, toTsParam, dayStepParam]);

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
    setLocalFromDate(date);
  };

  const handleToDateSelect = (date: Date | undefined) => {
    setLocalToDate(date);
  };

  const handleDayStepChange = (value: string) => {
    setLocalDayStep(Number(value));
  };

  const clearFromDate = () => {
    updateQueryParams("fromTs", null);
  };

  const clearToDate = () => {
    updateQueryParams("toTs", null);
  };

  const clearDayStep = () => {
    updateQueryParams("dayStep", null);
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (localFromDate) {
      params.set("fromTs", localFromDate.getTime().toString());
    } else {
      params.delete("fromTs");
    }

    if (localToDate) {
      params.set("toTs", localToDate.getTime().toString());
    } else {
      params.delete("toTs");
    }

    if (localDayStep !== 1) {
      params.set("dayStep", localDayStep.toString());
    } else {
      params.delete("dayStep");
    }

    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline">
              <Filter className="mr-2 mt-1 h-4 w-4" />
              {dictionary.filtersButton}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {dictionary.fromDate}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !localFromDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localFromDate
                        ? format(localFromDate, "PPP")
                        : dictionary.pickADate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={localFromDate}
                      onSelect={handleFromDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {dictionary.toDate}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !localToDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localToDate
                        ? format(localToDate, "PPP")
                        : dictionary.pickADate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={localToDate}
                      onSelect={handleToDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {dictionary.dayInterval}
                </label>
                <Select
                  value={localDayStep.toString()}
                  onValueChange={handleDayStepChange}
                >
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder={dictionary.selectInterval} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      {replacePlaceholders(dictionary.days, {
                        count: "1",
                      })}
                    </SelectItem>
                    <SelectItem value="7">
                      {replacePlaceholders(dictionary.days_plural, {
                        count: "7",
                      })}
                    </SelectItem>
                    <SelectItem value="14">
                      {replacePlaceholders(dictionary.days_plural, {
                        count: "14",
                      })}
                    </SelectItem>
                    <SelectItem value="30">
                      {replacePlaceholders(dictionary.days_plural, {
                        count: "30",
                      })}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={applyFilters} className="w-full">
                {dictionary.applyFilters}
              </Button>
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
              {dictionary.from} {format(fromDate, "PP")}
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
              {dictionary.to} {format(toDate, "PP")}
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

        {dayStep !== 1 ? (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1"
          >
            <span className="text-xs">
              {replacePlaceholders(dictionary.days_plural, {
                count: `${dayStep}`,
              })}
            </span>
            <button
              onClick={clearDayStep}
              className="ml-1 hover:text-destructive"
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ) : null}
      </div>
    </div>
  );
}
