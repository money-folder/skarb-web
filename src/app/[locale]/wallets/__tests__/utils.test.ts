import { WhistoryDb } from "../[id]/types";
import { ClientWalletDto } from "../types";
import { groupByCurrency } from "../utils";

describe("groupByCurrency", () => {
  const createWhistory = (amount: number): WhistoryDb => ({
    id: "whisthory-id",
    walletId: "wallet-id",
    moneyAmount: amount,
    date: new Date(),
    comment: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  });

  const createWallet = (
    currency: string,
    amount: number,
    includeAmount = true,
  ): ClientWalletDto => ({
    id: "test-id",
    name: "Test Wallet",
    currency,
    changes: 0,
    changesAbs: 0,
    sinceLatestBallanceTs: null,
    latestWhistory: includeAmount ? createWhistory(amount) : null,
    createdAt: new Date(),
    deletedAt: null,
  });

  it("should group multiple wallets by currency and sum their amounts", () => {
    const wallets: ClientWalletDto[] = [
      createWallet("USD", 100),
      createWallet("USD", 200),
      createWallet("EUR", 150),
      createWallet("EUR", 50),
      createWallet("JPY", 1000),
      createWallet("BYN", 0),
    ];

    const result = groupByCurrency(wallets);

    expect(result).toEqual([
      { currency: "USD", moneyAmount: 300 },
      { currency: "EUR", moneyAmount: 200 },
      { currency: "JPY", moneyAmount: 1000 },
      { currency: "BYN", moneyAmount: 0 },
    ]);
  });

  it("should handle empty wallet array", () => {
    const result = groupByCurrency([]);
    expect(result).toEqual([]);
  });

  it("should skip wallets without latestWhistory", () => {
    const wallets: ClientWalletDto[] = [
      createWallet("USD", 100),
      createWallet("USD", 200, false),
      createWallet("EUR", 150),
    ];

    const result = groupByCurrency(wallets);

    expect(result).toEqual([
      { currency: "USD", moneyAmount: 100 },
      { currency: "EUR", moneyAmount: 150 },
    ]);
  });

  it("should skip wallets with null latestWhistory", () => {
    const wallets: ClientWalletDto[] = [
      createWallet("USD", 100),
      {
        ...createWallet("USD", 0),
        latestWhistory: null,
      },
      createWallet("EUR", 150),
    ];

    const result = groupByCurrency(wallets);

    expect(result).toEqual([
      { currency: "USD", moneyAmount: 100 },
      { currency: "EUR", moneyAmount: 150 },
    ]);
  });

  it("should verify return object shape", () => {
    const wallets: ClientWalletDto[] = [
      createWallet("USD", 100),
      createWallet("EUR", 200),
    ];

    const result = groupByCurrency(wallets);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          currency: expect.any(String),
          moneyAmount: expect.any(Number),
        }),
      ]),
    );

    result.forEach((item) => {
      expect(Object.keys(item).sort()).toEqual(
        ["currency", "moneyAmount"].sort(),
      );
    });
  });

  it("should handle decimal amounts correctly", () => {
    const wallets: ClientWalletDto[] = [
      createWallet("USD", 100.5),
      createWallet("USD", 200.75),
      createWallet("EUR", 150.25),
    ];

    const result = groupByCurrency(wallets);

    expect(result).toEqual([
      { currency: "USD", moneyAmount: 301.25 },
      { currency: "EUR", moneyAmount: 150.25 },
    ]);
  });
});
