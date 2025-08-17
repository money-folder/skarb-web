import { ClientExpenseDto } from "../../types";
import { ExpensesChartEntry } from "./types";

export function getExpensesData(
  expenses: ClientExpenseDto[],
  expensesSum: number,
): ExpensesChartEntry[] {
  const map: Map<string, ExpensesChartEntry> = new Map();

  expenses.forEach((expense: ClientExpenseDto) => {
    const entry = map.get(expense.type);
    if (entry) {
      map.set(expense.type, {
        ...entry,
        value: entry.value + expense.moneyAmount,
      });
    } else {
      const color = getStoredColorFor(expense.type);
      map.set(expense.type, {
        name: expense.type,
        color: color ?? createNewColorFor(expense.type),
        value: expense.moneyAmount,
        label: expense.type,
      });
    }

    return map;
  });

  const untrackedExpenses =
    expensesSum - expenses.reduce((acc, item) => acc + item.moneyAmount, 0);

  if (untrackedExpenses > 0) {
    map.set("Untracked", {
      name: "Untracked",
      color: "#ccc",
      value: untrackedExpenses,
      label: "Untracked",
    });
  }

  return Array.from(map.values()).sort((a, b) => a.value - b.value);
}

const LOCAL_STORAGE_COLOR_PREFIX = "color-for";

function getStoredColorFor(type: string) {
  return window.localStorage.getItem(`${LOCAL_STORAGE_COLOR_PREFIX}-${type}`);
}

function createNewColorFor(type: string): string {
  const color = generatePastelColor();
  window.localStorage.setItem(`${LOCAL_STORAGE_COLOR_PREFIX}-${type}`, color);
  return color;
}

export function generatePastelColor(): string {
  const randomChannel = () => Math.floor(Math.random() * 80 + 100);
  const r = randomChannel();
  const g = randomChannel();
  const b = randomChannel();

  const toHex = (n: number) => n.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
