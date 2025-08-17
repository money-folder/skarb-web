import { AppData } from "./types";

const formatDateForSQL = (date: string | null) => {
  if (!date) {
    return "NULL";
  }

  return `'${new Date(date).toISOString()}'`;
};

const formatStringForSQL = (value: string | null) => {
  if (value === null || value === undefined) {
    return "NULL";
  }

  return `'${value.replace(/'/g, "''")}'`;
};

const formatValueForSQL = (value: unknown) => {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "string") {
    return formatStringForSQL(value);
  }

  if (value instanceof Date) {
    return formatDateForSQL(value.toISOString());
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }

  return formatStringForSQL(String(value));
};

export const generateSQLDump = (appData: AppData): string => {
  let sqlDump = "";

  sqlDump += "-- SQL Export Generated on " + new Date().toISOString() + "\n";
  sqlDump += "-- Based on user data export\n\n";

  sqlDump += `-- User data\n`;
  sqlDump += `INSERT INTO users (
    id,
    name,
    email,
    email_verified,
    image,
    created_at,
    updated_at,
    deleted_at
  ) VALUES (
    ${formatValueForSQL(appData.id)},
    ${formatValueForSQL(appData.name)},
    ${formatValueForSQL(appData.email)},
    ${formatValueForSQL(appData.emailVerified)},
    ${formatValueForSQL(appData.image)},
    ${formatValueForSQL(appData.createdAt)},
    ${formatValueForSQL(appData.updatedAt)},
    ${formatValueForSQL(appData.deletedAt)}
  );\n\n`;

  if (appData.wallets && Array.isArray(appData.wallets)) {
    sqlDump += `-- Wallet data\n`;

    appData.wallets.forEach((wallet) => {
      sqlDump += `INSERT INTO wallets (
        id,
        name,
        owner_id,
        currency,
        created_at,
        updated_at,
        deleted_at
      ) VALUES (
        ${formatValueForSQL(wallet.id)},
        ${formatValueForSQL(wallet.name)},
        ${formatValueForSQL(wallet.ownerId)},
        ${formatValueForSQL(wallet.currency)},
        ${formatValueForSQL(wallet.createdAt)},
        ${formatValueForSQL(wallet.updatedAt)},
        ${formatValueForSQL(wallet.deletedAt)}
      );\n`;

      if (
        wallet.history &&
        Array.isArray(wallet.history) &&
        wallet.history.length > 0
      ) {
        sqlDump += `\n-- Wallet history data for wallet ${formatStringForSQL(wallet.id)}\n`;

        wallet.history.forEach((entry) => {
          sqlDump += `INSERT INTO wallets_history (
            id,
            wallet_id,
            money_amount,
            date,
            comment,
            created_at,
            updated_at,
            deleted_at
          ) VALUES (
            ${formatValueForSQL(entry.id)},
            ${formatValueForSQL(entry.walletId)},
            ${entry.moneyAmount},
            ${formatValueForSQL(entry.date)},
            ${formatValueForSQL(entry.comment)},
            ${formatValueForSQL(entry.createdAt)},
            ${formatValueForSQL(entry.updatedAt)},
            ${formatValueForSQL(entry.deletedAt)}
          );\n`;
        });

        sqlDump += "\n";
      }
    });

    if (
      appData.expenses &&
      Array.isArray(appData.expenses) &&
      appData.expenses.length > 0
    ) {
      sqlDump += `\n-- Expenses data\n`;

      appData.expenses.forEach((expense) => {
        sqlDump += `INSERT INTO expenses (
          id,
          owner_id,
          date,
          money_amount,
          currency,
          type,
          comment,
          created_at,
          updated_at,
          deleted_at
        ) VALUES (
          ${formatValueForSQL(expense.id)},
          ${formatValueForSQL(expense.ownerId)},
          ${formatValueForSQL(expense.date)},
          ${expense.moneyAmount},
          ${formatValueForSQL(expense.currency)},
          ${formatValueForSQL(expense.type)},
          ${formatValueForSQL(expense.comment)},
          ${formatValueForSQL(expense.createdAt)},
          ${formatValueForSQL(expense.updatedAt)},
          ${formatValueForSQL(expense.deletedAt)}
        );\n`;
      });

      sqlDump += "\n";
    }
  }

  return sqlDump;
};
