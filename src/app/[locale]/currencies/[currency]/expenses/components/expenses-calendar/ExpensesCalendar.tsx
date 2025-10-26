"use client";

import { Card } from "@/components/ui/card";
import { DictionaryContext } from "@/shared/components/Dictionary";
import { useContext, useMemo, useRef } from "react";
import { ClientExpenseDto } from "../../types";
import {
  generateMonthsInRange,
  getDateSpan,
  groupExpensesByDay,
} from "./utils";

interface Props {
  expenses: ClientExpenseDto[];
  onDayClick?: (date: Date, dayExpenses: ClientExpenseDto[]) => void;
}

export default function ExpensesCalendar({ expenses, onDayClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { d } = useContext(DictionaryContext);
  const { start, end } = useMemo(() => getDateSpan(expenses), [expenses]);
  const monthsInRange = useMemo(
    () => generateMonthsInRange(start, end).reverse(),
    [start, end],
  );

  const groupedExpenses = useMemo(() => {
    const grouped = groupExpensesByDay(expenses);
    return grouped.reduce<Record<string, (typeof grouped)[0]>>((acc, day) => {
      acc[day.date.toISOString()] = day;
      return acc;
    }, {});
  }, [expenses]);

  const getMonthTotalAndMax = (monthDate: Date) => {
    const monthStart = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      1,
    );
    const monthEnd = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      0,
    );

    let monthTotal = 0;
    let maxDayAmount = 0;

    for (
      const date = new Date(monthStart);
      date <= monthEnd;
      date.setDate(date.getDate() + 1)
    ) {
      const dateKey = new Date(date.getTime()).setHours(0, 0, 0, 0);
      const dayData = groupedExpenses[new Date(dateKey).toISOString()];
      if (dayData) {
        monthTotal += Math.abs(dayData.totalAmount);
        maxDayAmount = Math.max(maxDayAmount, Math.abs(dayData.totalAmount));
      }
    }

    return { monthTotal, maxDayAmount };
  };

  const getExpenseIntensityColor = (amount: number, maxAmount: number) => {
    // Convert to percentage (0-1)
    const intensity = amount / maxAmount;

    // Use a softer red-based color with varying opacity
    return `rgba(255, 68, 68, ${Math.max(0.1, intensity)})`;
  };

  const renderMonth = (monthDate: Date) => {
    const daysInMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      0,
    ).getDate();
    const firstDayOfMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      1,
    );
    const startingDay = firstDayOfMonth.getDay();
    const monthName = monthDate.toLocaleString("default", { month: "long" });
    const { maxDayAmount } = getMonthTotalAndMax(monthDate);

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-14 p-0.5" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        day,
      );
      currentDate.setHours(0, 0, 0, 0);
      const dateKey = currentDate.toISOString();
      const dayData = groupedExpenses[dateKey];
      const hasExpenses = !!dayData;

      days.push(
        <div
          key={dateKey}
          className={`h-14 p-0.5 ${
            hasExpenses
              ? "cursor-pointer transition-colors hover:bg-gray-100"
              : ""
          }`}
          onClick={() => {
            if (hasExpenses && onDayClick) {
              onDayClick(currentDate, dayData.expenses);
            }
          }}
        >
          <div
            className="h-full rounded border p-0.5"
            style={{
              backgroundColor: hasExpenses
                ? getExpenseIntensityColor(
                    Math.abs(dayData.totalAmount),
                    maxDayAmount,
                  )
                : "transparent",
            }}
          >
            <div className="text-[10px] text-gray-900">{day}</div>
            {hasExpenses && (
              <div className="mt-0.5 text-[10px] font-semibold">
                {Math.abs(dayData.totalAmount).toFixed(2)}
              </div>
            )}
          </div>
        </div>,
      );
    }

    return (
      <Card key={monthDate.toISOString()} className="mb-3 p-2.5">
        <h3 className="mb-1.5 text-base font-semibold">
          {monthName} {monthDate.getFullYear()}
        </h3>
        <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-[10px] text-gray-500">
          <div>{d.currencyPage.expensesContainer.calendar.days.sun}</div>
          <div>{d.currencyPage.expensesContainer.calendar.days.mon}</div>
          <div>{d.currencyPage.expensesContainer.calendar.days.tue}</div>
          <div>{d.currencyPage.expensesContainer.calendar.days.wed}</div>
          <div>{d.currencyPage.expensesContainer.calendar.days.thu}</div>
          <div>{d.currencyPage.expensesContainer.calendar.days.fri}</div>
          <div>{d.currencyPage.expensesContainer.calendar.days.sat}</div>
        </div>
        <div className="grid grid-cols-7 gap-0.5">{days}</div>
      </Card>
    );
  };

  return (
    <div ref={containerRef} className="h-full space-y-4">
      {monthsInRange.map((monthDate) => renderMonth(monthDate))}
    </div>
  );
}
