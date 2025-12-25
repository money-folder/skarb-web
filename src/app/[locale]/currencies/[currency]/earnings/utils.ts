import { ClientEarningDto } from "./types";

export const groupEarningsByDay = (earnings: ClientEarningDto[]) => {
  const groupedEarnings: Record<string, ClientEarningDto[]> = {};

  earnings.forEach((earning) => {
    const dateStr = earning.date.toLocaleDateString();
    if (!groupedEarnings[dateStr]) {
      groupedEarnings[dateStr] = [];
    }
    groupedEarnings[dateStr].push(earning);
  });

  // Sort dates in descending order (newest first)
  return Object.entries(groupedEarnings)
    .sort(([dateA], [dateB]) => {
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .map(([date, earnings]) => ({
      date,
      earnings,
      totalAmount: earnings.reduce(
        (sum, earning) => sum + earning.moneyAmount,
        0,
      ),
    }));
};
