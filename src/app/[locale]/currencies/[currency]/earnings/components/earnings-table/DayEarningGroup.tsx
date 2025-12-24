"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ClientEarningDto } from "../../types";

interface DayEarningGroupProps {
  date: string;
  earnings: ClientEarningDto[];
  totalAmount: number;
  currency: string;
  initialExpanded?: boolean;
}

const DayEarningGroup = ({
  date,
  earnings,
  totalAmount,
  currency,
  initialExpanded = false,
}: DayEarningGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="overflow-hidden rounded-md border">
      <div
        className="flex cursor-pointer items-center justify-between bg-muted p-2"
        onClick={toggleExpansion}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <h3 className="font-medium">{date}</h3>
        </div>
        <div className="flex items-center gap-2 font-semibold">
          <span>
            {totalAmount.toFixed(2)} {currency}
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-xs">
            {earnings.length}
          </span>
        </div>
      </div>

      {isExpanded && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-left">Comment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {earnings.map((earning) => (
              <TableRow key={earning.id}>
                <TableCell
                  className={`text-left ${earning.deletedAt ? "opacity-30" : ""}`}
                >
                  {earning.type}
                </TableCell>
                <TableCell
                  className={`text-right ${earning.deletedAt ? "opacity-30" : ""}`}
                >
                  {earning.moneyAmount.toFixed(2)} {currency}
                </TableCell>
                <TableCell
                  className={`text-center ${earning.deletedAt ? "opacity-30" : ""}`}
                >
                  {new Date(earning.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell
                  className={`text-left ${earning.deletedAt ? "opacity-30" : ""}`}
                >
                  {earning.comment || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default DayEarningGroup;
