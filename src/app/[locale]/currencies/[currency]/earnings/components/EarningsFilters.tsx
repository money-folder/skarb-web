"use client";

import { format } from "date-fns";
import { CalendarIcon, Filter, Tag, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dictionary } from "@/dictionaries/locale";
import { cn } from "@/lib/utils";

interface Props {
  types: string[];
  dictionary: Dictionary["currencyPage"]["earningsContainer"]["earningsFilters"];
}

export default function EarningsFilters({ types, dictionary }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  const fromTsParam = searchParams.get("fromTs");
  const toTsParam = searchParams.get("toTs");
  const typesParam = searchParams.get("types");
  const commentParam = searchParams.get("comment");

  const fromDate = fromTsParam ? new Date(Number(fromTsParam)) : undefined;
  const toDate = toTsParam ? new Date(Number(toTsParam)) : undefined;
  const selectedTypes = typesParam ? typesParam.split(",") : [];
  const commentFilter = commentParam || "";

  // Local state for pending filter changes
  const [localFromDate, setLocalFromDate] = useState<Date | undefined>(
    fromDate,
  );
  const [localToDate, setLocalToDate] = useState<Date | undefined>(toDate);
  const [localSelectedTypes, setLocalSelectedTypes] =
    useState<string[]>(selectedTypes);
  const [localComment, setLocalComment] = useState<string>(commentFilter);

  // Sync local state with URL params when they change
  useEffect(() => {
    setLocalFromDate(fromDate);
    setLocalToDate(toDate);
    setLocalSelectedTypes(selectedTypes);
    setLocalComment(commentFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromTsParam, toTsParam, typesParam, commentParam]);

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

  const clearFromDate = () => {
    updateQueryParams("fromTs", null);
  };

  const clearToDate = () => {
    updateQueryParams("toTs", null);
  };

  const toggleType = (type: string) => {
    const newSelectedTypes = localSelectedTypes.includes(type)
      ? localSelectedTypes.filter((t) => t !== type)
      : [...localSelectedTypes, type];

    setLocalSelectedTypes(newSelectedTypes);
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

    if (localSelectedTypes.length === 0) {
      params.delete("types");
    } else {
      params.set("types", localSelectedTypes.join(","));
    }

    if (localComment.trim()) {
      params.set("comment", localComment.trim());
    } else {
      params.delete("comment");
    }

    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const clearTypes = () => {
    updateQueryParams("types", null);
  };

  const clearComment = () => {
    updateQueryParams("comment", null);
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

              {types.length > 0 && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    {dictionary.types}
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[240px] justify-start text-left font-normal"
                      >
                        <Tag className="mr-2 h-4 w-4" />
                        {localSelectedTypes.length > 0
                          ? `${localSelectedTypes.length} selected`
                          : dictionary.selectTypes}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[240px]">
                      <DropdownMenuLabel>
                        {dictionary.selectTypes}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {types.map((type) => (
                        <DropdownMenuCheckboxItem
                          key={type}
                          checked={localSelectedTypes.includes(type)}
                          onCheckedChange={() => toggleType(type)}
                          onSelect={(e) => e.preventDefault()}
                        >
                          {type}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {dictionary.comment}
                </label>
                <Input
                  type="text"
                  placeholder={dictionary.commentPlaceholder}
                  value={localComment}
                  onChange={(e) => setLocalComment(e.target.value)}
                  className="w-[240px]"
                />
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

        {selectedTypes.length > 0 && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1"
          >
            <span className="text-xs">
              {dictionary.typesLabel} {selectedTypes.length}
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

        {commentFilter && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1"
          >
            <span className="text-xs">
              {dictionary.commentLabel} {commentFilter}
            </span>
            <button
              onClick={clearComment}
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
