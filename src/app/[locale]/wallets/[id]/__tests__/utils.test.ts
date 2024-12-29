import { WhistoryDbWithWallet } from "../types";
import {
  composeWhistoryMoneyAmount,
  getWhistoryWithinInterval,
  // groupWhistoryByDate,
  groupWhistoryByWallets,
  WhistoryByDate,
} from "../utils";

const createDate = (dateStr: string) => new Date(dateStr);

const createWhistory = (
  overrides: Partial<WhistoryDbWithWallet> = {},
): WhistoryDbWithWallet => ({
  id: "whisthory-id",
  walletId: "wallet-1",
  moneyAmount: 100,
  date: new Date("2024-01-01"),
  comment: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  wallet: {
    id: "wallet-1",
    name: "Test Wallet",
    currency: "USD",
    ownerId: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  ...overrides,
});

describe("getWhistoryWithinInterval", () => {
  const whistories = [
    createWhistory({ date: createDate("2024-01-01") }),
    createWhistory({ date: createDate("2024-01-02") }),
    createWhistory({ date: createDate("2024-01-03") }),
    createWhistory({ date: createDate("2024-01-04") }),
    createWhistory({ date: createDate("2024-01-05") }),
  ];

  it("should return all records when no params provided", () => {
    const result = getWhistoryWithinInterval(whistories, {});
    expect(result).toHaveLength(5);
  });

  it("should filter by fromTs", () => {
    const result = getWhistoryWithinInterval(whistories, {
      fromTs: createDate("2024-01-03").valueOf(),
    });
    expect(result).toHaveLength(3);
    expect(result[0].date).toEqual(createDate("2024-01-03"));
  });

  it("should filter by toTs", () => {
    const result = getWhistoryWithinInterval(whistories, {
      toTs: createDate("2024-01-03").valueOf(),
    });
    expect(result).toHaveLength(3);
    expect(result[result.length - 1].date).toEqual(createDate("2024-01-03"));
  });

  it("should filter by both fromTs and toTs", () => {
    const result = getWhistoryWithinInterval(whistories, {
      fromTs: createDate("2024-01-02").valueOf(),
      toTs: createDate("2024-01-04").valueOf(),
    });
    expect(result).toHaveLength(3);
  });
});

describe("groupWhistoryByWallets", () => {
  it("should group whistories by wallet ID", () => {
    const whistories = [
      createWhistory({ walletId: "wallet-1", id: "1" }),
      createWhistory({ walletId: "wallet-1", id: "2" }),
      createWhistory({ walletId: "wallet-2", id: "3" }),
    ];

    const result = groupWhistoryByWallets(whistories);

    expect(Object.keys(result)).toHaveLength(2);
    expect(result["wallet-1"]).toHaveLength(2);
    expect(result["wallet-2"]).toHaveLength(1);
  });

  it("should handle empty array", () => {
    const result = groupWhistoryByWallets([]);
    expect(result).toEqual({});
  });
});

// describe("groupWhistoryByDate", () => {
//   const dataByWallets: WhistoryByWallets = {
//     "wallet-1": [
//       createWhistory({
//         walletId: "wallet-1",
//         date: createDate("2024-01-01"),
//         moneyAmount: 100,
//       }),
//       createWhistory({
//         walletId: "wallet-1",
//         date: createDate("2024-01-03"),
//         moneyAmount: 150,
//       }),
//     ],
//     "wallet-2": [
//       createWhistory({
//         walletId: "wallet-2",
//         date: createDate("2024-01-02"),
//         moneyAmount: 200,
//       }),
//     ],
//   };
// });

describe("composeWhistoryMoneyAmount", () => {
  const createWhistoryGroup = (
    date: string,
    amounts: number[],
  ): WhistoryByDate[0] => ({
    date: createDate(date),
    walletsMap: amounts.reduce(
      (acc, amount, index) => ({
        ...acc,
        [`wallet-${index + 1}`]: createWhistory({
          walletId: `wallet-${index + 1}`,
          moneyAmount: amount,
          wallet: {
            ...createWhistory().wallet,
            id: `wallet-${index + 1}`,
            name: `Wallet ${index + 1}`,
          },
        }),
      }),
      {},
    ),
  });

  it("should calculate money amounts and changes correctly", () => {
    const whistoryByDate: WhistoryByDate = [
      createWhistoryGroup("2024-01-01", [100, 200]),
      createWhistoryGroup("2024-01-02", [150, 250]),
    ];

    const result = composeWhistoryMoneyAmount(whistoryByDate);

    expect(result[0].moneyAmount).toBe(300);
    expect(result[1].moneyAmount).toBe(400);
    expect(result[1].changes).toBe(1 / 3);
    expect(result[1].changesAbs).toBe(100);
  });

  it("should handle first entry with no previous data", () => {
    const whistoryByDate: WhistoryByDate = [
      createWhistoryGroup("2024-01-01", [100, 200]),
    ];

    const result = composeWhistoryMoneyAmount(whistoryByDate);

    expect(result[0].changes).toBeNull();
    expect(result[0].changesAbs).toBeNull();
  });

  it("should round money amounts to 2 decimal places", () => {
    const whistoryByDate: WhistoryByDate = [
      createWhistoryGroup("2024-01-01", [100.123, 200.456]),
    ];

    const result = composeWhistoryMoneyAmount(whistoryByDate);

    expect(result[0].moneyAmount).toBe(300.58);
  });
});
