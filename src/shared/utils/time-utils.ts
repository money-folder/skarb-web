import { Locale } from "@/locale";

export const getLocalISOString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export interface DateDifference {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const calculateDateDifference = (
  date1: Date,
  date2: Date,
): DateDifference => {
  const startDate = date1 < date2 ? new Date(date1) : new Date(date2);
  const endDate = date1 < date2 ? new Date(date2) : new Date(date1);

  let years = 0;
  let months = 0;
  let days = 0;

  while (
    new Date(
      startDate.getFullYear() + 1,
      startDate.getMonth(),
      startDate.getDate(),
    ) <= endDate
  ) {
    years++;
    startDate.setFullYear(startDate.getFullYear() + 1);
  }

  while (
    new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate(),
    ) <= endDate
  ) {
    months++;
    startDate.setMonth(startDate.getMonth() + 1);
  }

  while (startDate < endDate) {
    startDate.setDate(startDate.getDate() + 1);
    days++;
  }

  if (startDate > endDate) {
    startDate.setDate(startDate.getDate() - 1);
    days--;
  }

  const remainingDiff = endDate.getTime() - startDate.getTime();

  const millisecondsInSecond = 1000;
  const millisecondsInMinute = millisecondsInSecond * 60;
  const millisecondsInHour = millisecondsInMinute * 60;

  let diff = remainingDiff;

  const hours = Math.floor(diff / millisecondsInHour);
  diff -= hours * millisecondsInHour;

  const minutes = Math.floor(diff / millisecondsInMinute);
  diff -= minutes * millisecondsInMinute;

  const seconds = Math.floor(diff / millisecondsInSecond);

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
};

export const formatDateDifferenceEn = (
  diff: Partial<DateDifference>,
): string => {
  const parts: string[] = [];

  if (diff.years && diff.years > 0) {
    parts.push(`${diff.years} year${diff.years !== 1 ? "s" : ""}`);
  }

  if (diff.months && diff.months > 0) {
    parts.push(`${diff.months} month${diff.months !== 1 ? "s" : ""}`);
  }

  if (diff.days && diff.days > 0) {
    parts.push(`${diff.days} day${diff.days !== 1 ? "s" : ""}`);
  }

  if (diff.hours && diff.hours > 0) {
    parts.push(`${diff.hours} hour${diff.hours !== 1 ? "s" : ""}`);
  }

  if (diff.minutes && diff.minutes > 0) {
    parts.push(`${diff.minutes} min${diff.minutes !== 1 ? "s" : ""}`);
  }

  if (diff.seconds && diff.seconds > 0) {
    parts.push(`${diff.seconds} second${diff.seconds !== 1 ? "s" : ""}`);
  }

  return parts.length > 0 ? parts.join(", ") : "Just now!";
};

export const formatDateDifferenceBe = (
  diff: Partial<DateDifference>,
): string => {
  const parts: string[] = [];

  if (diff.years && diff.years > 0) {
    parts.push(
      `${diff.years} год${diff.years.toString().endsWith("1") ? "" : "ы"}`,
    );
  }

  if (diff.months && diff.months > 0) {
    parts.push(
      `${diff.months} месяц${diff.months.toString().endsWith("1") ? "" : "ы"}`,
    );
  }

  if (diff.days && diff.days > 0) {
    parts.push(
      `${diff.days} ${diff.days.toString().endsWith("1") ? "дзень" : "дні"}`,
    );
  }

  if (diff.hours && diff.hours > 0) {
    parts.push(
      `${diff.hours} гадзін${diff.hours.toString().endsWith("1") ? "а" : "ы"}`,
    );
  }

  if (diff.minutes && diff.minutes > 0) {
    parts.push(
      `${diff.minutes} хвілін${
        diff.minutes.toString().endsWith("1") ? "а" : "ы"
      }`,
    );
  }

  if (diff.seconds && diff.seconds > 0) {
    parts.push(
      `${diff.seconds} секунд${
        diff.seconds.toString().endsWith("1") ? "а" : "ы"
      }`,
    );
  }

  return parts.length > 0 ? parts.join(", ") : "Толькі што!";
};

export const formatDateDifference = (
  diff: Partial<DateDifference>,
  locale: Locale,
): string => {
  if (locale === "be") {
    return formatDateDifferenceBe(diff);
  }

  return formatDateDifferenceEn(diff);
};

export const isValidDate = (d: Date) =>
  d instanceof Date && !isNaN(d.getTime());

export const getMonthStart = (date: Date): Date => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  return start;
};

export const getMonthStartTs = (date: Date): number => {
  const start = getMonthStart(date);
  return start.getTime();
};

/**
 * Formats a date to show only the date part (without time) using locale string format.
 * @param date - The date to format
 * @returns The date string without the time component
 * @example formatDateOnly(new Date()) // "12/30/2025"
 */
export const formatDateOnly = (date: Date): string => {
  return date.toLocaleString().split(",")[0];
};
