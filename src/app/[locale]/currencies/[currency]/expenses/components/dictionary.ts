import { ExpensesDictionary } from "../dictionary";

export type ExpensesContainerDictionary = {
  createButtonLabel: string;
  noExpenses: string;
  loadingFailed: string;
  totalExpenses: string;
  trackedExpenses: string;
  overviewTab: string;
  calendarTab: string;
  calendar: {
    days: {
      sun: string;
      mon: string;
      tue: string;
      wed: string;
      thu: string;
      fri: string;
      sat: string;
    };
    total: string;
    weekTotal: string;
  };
  expenses: ExpensesDictionary;
};
