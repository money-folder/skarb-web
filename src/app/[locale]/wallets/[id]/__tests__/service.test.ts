import * as whistoryRepository from "@/app/[locale]/wallets/[id]/repository";
import * as walletsRepository from "@/app/[locale]/wallets/repository";
import { auth } from "@/auth";
import { ErrorCauses } from "@/shared/types/errors";

import * as whistoryService from "../service";

jest.mock("@/auth");
jest.mock("@/app/[locale]/wallets/[id]/repository");
jest.mock("@/app/[locale]/wallets/repository");

describe("Wallet Service", () => {
  describe("verifyWhistoryOwnership", () => {
    const mockUserId = "user-123";
    const mockWhistoryId = "whistory-456";

    it("should return true when wallet exists and user owns it", async () => {
      const mockWallet = {
        ownerId: mockUserId,
        id: mockWhistoryId,
      };

      (whistoryRepository.findWallet as jest.Mock).mockResolvedValue(
        mockWallet,
      );

      const result = await whistoryService.verifyWhistoryOwnership(
        mockUserId,
        mockWhistoryId,
      );

      expect(result).toBe(true);
      expect(whistoryRepository.findWallet).toHaveBeenCalledWith(
        mockWhistoryId,
      );
      expect(whistoryRepository.findWallet).toHaveBeenCalledTimes(1);
    });

    it("should return false when wallet exists but user does not own it", async () => {
      const mockWallet = {
        ownerId: "different-user-789",
        id: mockWhistoryId,
      };
      (whistoryRepository.findWallet as jest.Mock).mockResolvedValue(
        mockWallet,
      );

      const result = await whistoryService.verifyWhistoryOwnership(
        mockUserId,
        mockWhistoryId,
      );

      expect(result).toBe(false);
      expect(whistoryRepository.findWallet).toHaveBeenCalledWith(
        mockWhistoryId,
      );
      expect(whistoryRepository.findWallet).toHaveBeenCalledTimes(1);
    });

    it("should return false when wallet does not exist", async () => {
      (whistoryRepository.findWallet as jest.Mock).mockResolvedValue(null);

      const result = await whistoryService.verifyWhistoryOwnership(
        mockUserId,
        mockWhistoryId,
      );

      expect(result).toBe(false);
      expect(whistoryRepository.findWallet).toHaveBeenCalledWith(
        mockWhistoryId,
      );
      expect(whistoryRepository.findWallet).toHaveBeenCalledTimes(1);
    });
  });

  describe("getCurrentUserWalletHistory", () => {
    const mockUserId = "user-123";
    const mockWalletId = "wallet-456";
    const mockParams = {};

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw unauthorized error when user is not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue(null);

      await expect(
        whistoryService.getCurrentUserWalletHistory(mockWalletId, mockParams),
      ).rejects.toThrow(
        new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED }),
      );
    });

    it("should throw not found error when wallet history doesn't exist", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
      (whistoryRepository.findUserWallet as jest.Mock).mockResolvedValue(null);

      await expect(
        whistoryService.getCurrentUserWalletHistory(mockWalletId, mockParams),
      ).rejects.toThrow(
        new Error("Wallet history was not found!", {
          cause: ErrorCauses.NOT_FOUND,
        }),
      );
    });

    it("should calculate changes and sums correctly for wallet history", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
      const mockWalletHistory = [
        { id: "1", moneyAmount: 1000 },
        { id: "2", moneyAmount: 1500 },
        { id: "3", moneyAmount: 1200 },
      ];
      (whistoryRepository.findUserWallet as jest.Mock).mockResolvedValue(
        mockWalletHistory,
      );

      const result = await whistoryService.getCurrentUserWalletHistory(
        mockWalletId,
        mockParams,
      );

      expect(result.whistory).toHaveLength(3);
      expect(result.whistory[0].changes).toBe(null);
      expect(result.whistory[1].changes).toBe(0.5);
      expect(result.whistory[2].changes).toBe(-0.2);
      expect(result.increasesSum).toBe(500);
      expect(result.decreasesSum).toBe(-300);
      expect(result.increasesDecreasesDiff).toBe(200);
      expect(whistoryRepository.findUserWallet).toHaveBeenCalledWith(
        mockUserId,
        mockWalletId,
        mockParams,
      );
    });

    it("should handle wallet history with no changes", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
      const mockWalletHistory = [{ id: "1", moneyAmount: 1000 }];
      (whistoryRepository.findUserWallet as jest.Mock).mockResolvedValue(
        mockWalletHistory,
      );

      const result = await whistoryService.getCurrentUserWalletHistory(
        mockWalletId,
        mockParams,
      );

      expect(result.whistory).toHaveLength(1);
      expect(result.whistory[0].changes).toBe(null);
      expect(result.whistory[0].changesAbs).toBe(null);
      expect(result.increasesSum).toBe(0);
      expect(result.decreasesSum).toBe(0);
      expect(result.increasesDecreasesDiff).toBe(0);
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

      const result = await whistoryService.getUserWalletsHistoryByCurrency(
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

      const result = await whistoryService.getUserWalletsHistoryByCurrency(
        mockUserId,
        mockCurrency,
      );

      expect(result).toEqual([]);
      expect(whistoryRepository.findByWallet).not.toHaveBeenCalled();
    });
  });

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
        whistoryService.getCurrentUserCurrencyWhistory(
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
        .spyOn(whistoryService, "getUserWalletsHistoryByCurrency")
        .mockResolvedValue([]);

      const result = await whistoryService.getCurrentUserCurrencyWhistory(
        "USD",
        {},
      );
      expect(result).toEqual([]);
    });

    it("processes wallet history correctly with date range", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
      jest
        .spyOn(whistoryService, "getUserWalletsHistoryByCurrency")
        .mockResolvedValue(mockWhistoryData);

      const result = await whistoryService.getCurrentUserCurrencyWhistory(
        "USD",
        {
          fromTs: new Date("2024-01-01T00:00:00Z").valueOf(),
          toTs: new Date("2024-01-02T23:59:59Z").valueOf(),
        },
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("date");
      expect(result[0]).toHaveProperty("whistories");
      expect(result[0]).toHaveProperty("moneyAmount");
      expect(result[0]).toHaveProperty("changes");
      expect(result[0]).toHaveProperty("changesAbs");
    });
  });

  describe("createWhistory", () => {
    const mockUserId = "user-123";

    it("should create a new whistory entry with converted date", async () => {
      const mockDto = {
        walletId: "wallet-123",
        moneyAmount: 100,
        date: new Date("2024-01-01T10:00:00Z").valueOf(),
        comment: "Test entry",
      };

      const expectedCreate = {
        ...mockDto,
        date: new Date(mockDto.date),
      };

      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });

      await whistoryService.createWhistory(mockDto);

      expect(whistoryRepository.create).toHaveBeenCalledWith(expectedCreate);
    });
  });

  describe("duplicateWhistory", () => {
    const mockUserId = "user-123";
    const mockWhistoryId = "whistory-123";
    const mockWalletId = "wallet-123";
    const baseDate = new Date("2024-01-01T10:00:00Z");

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should duplicate a whistory entry successfully", async () => {
      const mockSession = { user: { id: mockUserId } };
      const mockTarget = {
        id: mockWhistoryId,
        walletId: mockWalletId,
        moneyAmount: 100,
        date: baseDate,
      };
      const mockWallet = {
        id: mockWalletId,
        ownerId: mockUserId,
      };

      (auth as jest.Mock).mockResolvedValue(mockSession);
      (whistoryRepository.findById as jest.Mock).mockResolvedValue(mockTarget);
      (walletsRepository.findById as jest.Mock).mockResolvedValue(mockWallet);

      await whistoryService.duplicateWhistory(mockWhistoryId);

      expect(whistoryRepository.create).toHaveBeenCalledWith({
        moneyAmount: mockTarget.moneyAmount,
        walletId: mockTarget.walletId,
        date: expect.any(Date),
      });
    });

    it("should throw unauthorized error when user is not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue(null);

      await expect(
        whistoryService.duplicateWhistory(mockWhistoryId),
      ).rejects.toThrow(
        new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED }),
      );
    });

    it("should throw not found error when target whistory doesn't exist", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
      (whistoryRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        whistoryService.duplicateWhistory(mockWhistoryId),
      ).rejects.toThrow(
        new Error("Target wallet history entry was not found!", {
          cause: ErrorCauses.NOT_FOUND,
        }),
      );
    });

    it("should throw forbidden error when user doesn't own the wallet", async () => {
      const mockSession = { user: { id: mockUserId } };
      const mockTarget = {
        id: mockWhistoryId,
        walletId: mockWalletId,
        moneyAmount: 100,
      };
      const mockWallet = {
        id: mockWalletId,
        ownerId: "different-user",
      };

      (auth as jest.Mock).mockResolvedValue(mockSession);
      (whistoryRepository.findById as jest.Mock).mockResolvedValue(mockTarget);
      (walletsRepository.findById as jest.Mock).mockResolvedValue(mockWallet);

      await expect(
        whistoryService.duplicateWhistory(mockWhistoryId),
      ).rejects.toThrow(
        new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN }),
      );
    });
  });

  describe("whistory management operations", () => {
    const mockUserId = "user-123";
    const mockWhistoryId = "whistory-123";

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("archiveSelfWhistory", () => {
      it("should archive whistory when user is authorized", async () => {
        (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
        jest
          .spyOn(whistoryService, "verifyWhistoryOwnership")
          .mockResolvedValue(true);

        jest.mock("../service.ts", () => ({
          verifyWhistoryOwnership: jest.fn().mockResolvedValue(true),
        }));

        await whistoryService.archiveSelfWhistory(mockWhistoryId);

        expect(whistoryRepository.archive).toHaveBeenCalledWith(mockWhistoryId);
      });

      it("should throw unauthorized error when user is not authenticated", async () => {
        (auth as jest.Mock).mockResolvedValue(null);

        await expect(
          whistoryService.archiveSelfWhistory(mockWhistoryId),
        ).rejects.toThrow(
          new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED }),
        );
      });

      it("should throw forbidden error when user is not owner", async () => {
        (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
        jest
          .spyOn(whistoryService, "verifyWhistoryOwnership")
          .mockResolvedValue(false);

        await expect(
          whistoryService.archiveSelfWhistory(mockWhistoryId),
        ).rejects.toThrow(
          new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN }),
        );
      });
    });

    describe("unarchiveSelfWhistory", () => {
      it("should unarchive whistory when user is authorized", async () => {
        (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
        jest
          .spyOn(whistoryService, "verifyWhistoryOwnership")
          .mockResolvedValue(true);

        await whistoryService.unarchiveSelfWhistory(mockWhistoryId);

        expect(whistoryRepository.unarchive).toHaveBeenCalledWith(
          mockWhistoryId,
        );
      });

      it("should throw unauthorized error when user is not authenticated", async () => {
        (auth as jest.Mock).mockResolvedValue(null);

        await expect(
          whistoryService.unarchiveSelfWhistory(mockWhistoryId),
        ).rejects.toThrow(
          new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED }),
        );
      });

      it("should throw forbidden error when user is not owner", async () => {
        (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
        jest
          .spyOn(whistoryService, "verifyWhistoryOwnership")
          .mockResolvedValue(false);

        await expect(
          whistoryService.unarchiveSelfWhistory(mockWhistoryId),
        ).rejects.toThrow(
          new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN }),
        );
      });
    });

    describe("destroySelfWhistory", () => {
      it("should destroy whistory when user is authorized", async () => {
        (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
        jest
          .spyOn(whistoryService, "verifyWhistoryOwnership")
          .mockResolvedValue(true);

        await whistoryService.destroySelfWhistory(mockWhistoryId);

        expect(whistoryRepository.destroy).toHaveBeenCalledWith(mockWhistoryId);
      });

      it("should throw unauthorized error when user is not authenticated", async () => {
        (auth as jest.Mock).mockResolvedValue(null);

        await expect(
          whistoryService.destroySelfWhistory(mockWhistoryId),
        ).rejects.toThrow(
          new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED }),
        );
      });

      it("should throw forbidden error when user is not owner", async () => {
        (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
        jest
          .spyOn(whistoryService, "verifyWhistoryOwnership")
          .mockResolvedValue(false);

        await expect(
          whistoryService.destroySelfWhistory(mockWhistoryId),
        ).rejects.toThrow(
          new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN }),
        );
      });
    });
  });
});
