export interface DateDifference {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const millisecondsInSecond = 1000;
const millisecondsInMinute = millisecondsInSecond * 60;
const millisecondsInHour = millisecondsInMinute * 60;
const millisecondsInDay = millisecondsInHour * 24;
const millisecondsInMonth = millisecondsInDay * 30;
const millisecondsInYear = millisecondsInDay * 365;

export const calculateDateDifference = (
  date1: Date,
  date2: Date
): DateDifference => {
  let diff = Math.abs(date1.getTime() - date2.getTime());

  const years = Math.floor(diff / millisecondsInYear);
  diff -= years * millisecondsInYear;

  const months = Math.floor(diff / millisecondsInMonth);
  diff -= months * millisecondsInMonth;

  const days = Math.floor(diff / millisecondsInDay);
  diff -= days * millisecondsInDay;

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

export const formatDateDifference = (diff: Partial<DateDifference>): string => {
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
