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
        whistoryService.getCurrentUserWhistory(mockWalletId, mockParams),
      ).rejects.toThrow(
        new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED }),
      );
    });

    it("should throw not found error when wallet history doesn't exist", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
      (whistoryRepository.findUserWallet as jest.Mock).mockResolvedValue(null);

      await expect(
        whistoryService.getCurrentUserWhistory(mockWalletId, mockParams),
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

      const result = await whistoryService.getCurrentUserWhistory(
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

      const result = await whistoryService.getCurrentUserWhistory(
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
