export type ExpensesDictionary = {
  table: {
    type: string;
    amount: string;
    comment: string;
  };
  dayDialog: {
    title: string;
    addNewExpense: string;
    submit: string;
  };
  emptyState: {
    title: string;
    description: string;
    currency: string;
    from: string;
    to: string;
    types: string;
    comment: string;
    notSet: string;
  };
};
