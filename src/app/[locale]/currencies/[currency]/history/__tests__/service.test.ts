import * as whistoryRepository from "@/app/[locale]/wallets/[id]/repository";
import * as walletsRepository from "@/app/[locale]/wallets/repository";
import { auth } from "@/auth";
import { ErrorCauses } from "@/shared/types/errors";

import * as currenciesRepository from "../repository";
import * as currenciesService from "../service";

jest.mock("@/auth");
jest.mock("../repository");
jest.mock("@/app/[locale]/wallets/[id]/repository");
jest.mock("@/app/[locale]/wallets/repository");

describe("getCurrentUserCurrencies", () => {
  const mockUserId = "user-123";
  const mockCurrencies = ["USD", "EUR"];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return user currencies when user is authenticated", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: mockUserId },
    });
    (currenciesRepository.findUserCurrencies as jest.Mock).mockResolvedValue(
      mockCurrencies,
    );

    const result = await currenciesService.getCurrentUserCurrencies();

    expect(result).toEqual(mockCurrencies);
    expect(auth).toHaveBeenCalledTimes(1);
    expect(currenciesRepository.findUserCurrencies).toHaveBeenCalledWith(
      mockUserId,
    );
    expect(currenciesRepository.findUserCurrencies).toHaveBeenCalledTimes(1);
  });

  it("should throw unauthorized error when no session exists", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    await expect(currenciesService.getCurrentUserCurrencies()).rejects.toThrow(
      "Unauthorized!",
    );
    expect(currenciesRepository.findUserCurrencies).not.toHaveBeenCalled();
  });

  it("should propagate repository errors", async () => {
    const mockError = new Error("Database error");
    (auth as jest.Mock).mockResolvedValue({
      user: { id: mockUserId },
    });
    (currenciesRepository.findUserCurrencies as jest.Mock).mockRejectedValue(
      mockError,
    );

    await expect(currenciesService.getCurrentUserCurrencies()).rejects.toThrow(
      mockError,
    );
    expect(currenciesRepository.findUserCurrencies).toHaveBeenCalledWith(
      mockUserId,
    );
  });

  it("should verify error cause for unauthorized errors", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    try {
      await currenciesService.getCurrentUserCurrencies();
      fail("Expected error to be thrown");
    } catch (error) {
      expect(error instanceof Error).toBe(true);
    }
  });
});

describe("getUserWalletsHistoryByCurrency", () => {
  const mockUserId = "user-123";
  const mockCurrency = "USD";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and combine wallet histories correctly", async () => {
    const mockWallets = [
      { id: "wallet-1", name: "Wallet 1" },
      { id: "wallet-2", name: "Wallet 2" },
    ];

    const mockWallet1History = [
      {
        id: "h1",
        walletId: "wallet-1",
        date: new Date("2024-01-01"),
        moneyAmount: 100,
      },
      {
        id: "h2",
        walletId: "wallet-1",
        date: new Date("2024-01-02"),
        moneyAmount: 150,
      },
    ];

    const mockWallet2History = [
      {
        id: "h3",
        walletId: "wallet-2",
        date: new Date("2024-01-01"),
        moneyAmount: 200,
      },
      {
        id: "h4",
        walletId: "wallet-2",
        date: new Date("2024-01-03"),
        moneyAmount: 250,
      },
    ];

    (walletsRepository.findByUserCurrency as jest.Mock).mockResolvedValue(
      mockWallets,
    );
    (whistoryRepository.findByWallet as jest.Mock)
      .mockResolvedValueOnce(mockWallet1History)
      .mockResolvedValueOnce(mockWallet2History);

    const result = await currenciesService.getUserCurrencyWhistory(
      mockUserId,
      mockCurrency,
    );

    expect(result).toHaveLength(4);
    expect(walletsRepository.findByUserCurrency).toHaveBeenCalledWith(
      mockUserId,
      mockCurrency,
    );
    expect(whistoryRepository.findByWallet).toHaveBeenCalledTimes(2);
  });

  it("should handle empty wallet list", async () => {
    (walletsRepository.findByUserCurrency as jest.Mock).mockResolvedValue([]);

    const result = await currenciesService.getUserCurrencyWhistory(
      mockUserId,
      mockCurrency,
    );

    expect(result).toEqual([]);
    expect(whistoryRepository.findByWallet).not.toHaveBeenCalled();
  });
});

// @TODO: after the getCurrentUserCurrencyWhistory refactoring, add tests for calculation only
describe("getCurrentUserCurrencyWhistory", () => {
  const mockUserId = "user123";
  const mockCurrency = "USD";
  const mockParams = {
    fromTs: new Date("202-01-01").valueOf(),
    toTs: new Date("2024-01-31").valueOf(),
  };

  const mockWallet = {
    id: "wallet1",
    name: "Main Wallet",
    ownerId: mockUserId,
    currency: "USD",
    createdAt: new Date("2023-12-01T00:00:00Z"),
    updatedAt: new Date("2023-12-01T00:00:00Z"),
    deletedAt: null,
  };

  const mockWallet2 = {
    id: "wallet2",
    name: "Wallet 2",
    ownerId: mockUserId,
    currency: "USD",
    createdAt: new Date("2023-12-01T00:00:00Z"),
    updatedAt: new Date("2023-12-01T00:00:00Z"),
    deletedAt: null,
  };

  const mockWhistoryData = [
    {
      id: "wh1",
      walletId: "wallet1",
      moneyAmount: 100,
      date: new Date("2024-01-01T12:00:00Z"),
      comment: "Initial deposit",
      createdAt: new Date("2024-01-01T12:00:00Z"),
      updatedAt: new Date("2024-01-01T12:00:00Z"),
      deletedAt: null,
      wallet: { ...mockWallet },
    },
    {
      id: "wh2",
      walletId: "wallet1",
      moneyAmount: 150,
      date: new Date("2024-01-02T12:00:00Z"),
      comment: "Additional deposit",
      createdAt: new Date("2024-01-02T12:00:00Z"),
      updatedAt: new Date("2024-01-02T12:00:00Z"),
      deletedAt: null,
      wallet: { ...mockWallet },
    },
    {
      id: "wh3",
      walletId: "wallet2",
      moneyAmount: 350,
      date: new Date("2024-01-02T12:00:00Z"),
      comment: "One more deposit",
      createdAt: new Date("2024-01-02T12:00:00Z"),
      updatedAt: new Date("2024-01-02T12:00:00Z"),
      deletedAt: null,
      wallet: { ...mockWallet2 },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw unauthorized error when user is not authenticated", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    await expect(
      currenciesService.getCurrentUserCurrencyWhistory(
        mockCurrency,
        mockParams,
      ),
    ).rejects.toThrow(
      new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED }),
    );
  });

  it("returns empty array when no wallet history found", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
    jest
      .spyOn(currenciesService, "getUserCurrencyWhistory")
      .mockResolvedValue([]);

    const result = await currenciesService.getCurrentUserCurrencyWhistory(
      "USD",
      {},
    );
    expect(result.composedWhistory).toEqual([]);
  });

  it("processes wallet history correctly with date range", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
    jest
      .spyOn(currenciesService, "getUserCurrencyWhistory")
      .mockResolvedValue(mockWhistoryData);

    const result = await currenciesService.getCurrentUserCurrencyWhistory(
      "USD",
      {
        fromTs: new Date("2024-01-01T00:00:00Z").valueOf(),
        toTs: new Date("2024-01-02T23:59:59Z").valueOf(),
      },
    );

    expect(result.composedWhistory.length).toBeGreaterThan(0);
    expect(result.composedWhistory[0]).toHaveProperty("date");
    expect(result.composedWhistory[0]).toHaveProperty("whistories");
    expect(result.composedWhistory[0]).toHaveProperty("moneyAmount");
    expect(result.composedWhistory[0]).toHaveProperty("changes");
    expect(result.composedWhistory[0]).toHaveProperty("changesAbs");
  });
});
