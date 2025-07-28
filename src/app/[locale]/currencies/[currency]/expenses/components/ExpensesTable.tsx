import { getDictionary } from "@/dictionaries";
import { Locale } from "@/locale";
import { ClientExpenseDto } from "../types";
import DestroyButton from "./buttons/DestroyButton";

interface Props {
  locale: Locale;
  expenses: ClientExpenseDto[];
  currency: string;
}

export default async function ExpensesTable({
  locale,
  expenses,
  currency,
}: Props) {
  const d = await getDictionary(locale, "currencyPage.expensesTable");

  return (
    <div className="h-full w-full">
      <table className="w-full">
        <thead>
          <tr>
            <th className="w-3/12 border-2 border-black p-1 text-xs">
              {d.type}
            </th>
            <th className="w-2/12 border-2 border-black text-xs">
              {d.moneyAmount}
            </th>
            <th className="w-2/12 border-2 border-black p-1 text-xs">
              {d.date}
            </th>
            <th className="w-3/12 border-2 border-black p-1 text-xs">
              {d.comment}
            </th>
            <th className="w-2/12 border-2 border-black p-1 text-xs">
              {d.actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {[...expenses].reverse().map((expense) => (
            <tr key={expense.id}>
              <td
                className={`border-2 border-black p-1 text-center text-xs ${expense.deletedAt ? "opacity-30" : ""} `}
              >
                {expense.type}
              </td>
              <td
                className={`border-2 border-black p-1 text-center text-xs ${
                  expense.deletedAt ? "opacity-30" : ""
                }`}
              >
                {expense.moneyAmount}
              </td>
              <td
                className={`border-2 border-black p-1 text-center text-xs ${
                  expense.deletedAt ? "opacity-30" : ""
                }`}
              >
                {expense.date.toLocaleString().split(", ")[0]}
              </td>
              <td
                className={`space-x-2 border-2 border-black p-1 text-center text-xs`}
              >
                {expense.comment || `-`}
              </td>
              <td
                className={`space-x-1 border-2 border-black p-1 text-center text-xs`}
              >
                <DestroyButton id={expense.id} currency={currency} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
