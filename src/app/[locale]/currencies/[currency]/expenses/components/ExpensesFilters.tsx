"use client";

import { CalendarIcon, Filter, Tag, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DictionaryContext } from "@/shared/components/Dictionary";
import { format } from "date-fns";

interface Props {
  types: string[];
}

export default function ExpensesFilters({ types }: Props) {
  const { d } = useContext(DictionaryContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  const fromTsParam = searchParams.get("fromTs");
  const toTsParam = searchParams.get("toTs");
  const typesParam = searchParams.get("types");

  const fromDate = fromTsParam ? new Date(Number(fromTsParam)) : undefined;
  const toDate = toTsParam ? new Date(Number(toTsParam)) : undefined;
  const selectedTypes = typesParam ? typesParam.split(",") : [];

  // Set fromTs to start of current month on first render if not already set
  useEffect(() => {
    if (!fromTsParam) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      updateQueryParams("fromTs", startOfMonth.getTime().toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const toggleType = (type: string) => {
    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    if (newSelectedTypes.length === 0) {
      updateQueryParams("types", null);
    } else {
      updateQueryParams("types", newSelectedTypes.join(","));
    }
  };

  const clearTypes = () => {
    updateQueryParams("types", null);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline">
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

              {types.length > 0 && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    {d.whistoryPage.filters.types}
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[240px] justify-start text-left font-normal"
                      >
                        <Tag className="mr-2 h-4 w-4" />
                        {selectedTypes.length > 0
                          ? `${selectedTypes.length} selected`
                          : d.whistoryPage.filters.selectTypes}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[240px]">
                      <DropdownMenuLabel>
                        {d.whistoryPage.filters.selectTypes}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {types.map((type) => (
                        <DropdownMenuCheckboxItem
                          key={type}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleType(type)}
                        >
                          {type}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
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

        {selectedTypes.length > 0 && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1"
          >
            <span className="text-xs">
              {d.whistoryPage.filters.types}
              {": "}
              {selectedTypes.length}
            </span>
            <button
              onClick={clearTypes}
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
