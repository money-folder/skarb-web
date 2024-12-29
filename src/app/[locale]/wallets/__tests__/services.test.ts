import * as walletsRepository from "@/app/[locale]/wallets/repository";
import * as walletsService from "@/app/[locale]/wallets/service";
import { auth } from "@/auth";

jest.mock("@/auth");
jest.mock("@/app/[locale]/wallets/repository");

describe("Wallets Services", () => {
  const mockUserId = "user123";
  const mockWallet = {
    id: "wallet123",
    ownerId: mockUserId,
    name: "Test Wallet",
    currency: "USD",
    history: [
      { moneyAmount: 1000, date: new Date("2024-01-02") },
      { moneyAmount: 800, date: new Date("2024-01-01") },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("verifyWalletOwnership", () => {
    it("should return true when wallet belongs to user", async () => {
      (walletsRepository.findById as jest.Mock).mockResolvedValue(mockWallet);
      const result = await walletsService.verifyWalletOwnership(
        mockUserId,
        mockWallet.id,
      );
      expect(result).toBe(true);
    });

    it("should return false when wallet not found", async () => {
      (walletsRepository.findById as jest.Mock).mockResolvedValue(null);
      const result = await walletsService.verifyWalletOwnership(
        mockUserId,
        "wallet123",
      );
      expect(result).toBe(false);
    });

    it("should return false when wallet belongs to different user", async () => {
      (walletsRepository.findById as jest.Mock).mockResolvedValue({
        ...mockWallet,
        ownerId: "differentUser",
      });
      const result = await walletsService.verifyWalletOwnership(
        mockUserId,
        "wallet123",
      );
      expect(result).toBe(false);
    });

    it("should handle repository errors", async () => {
      (walletsRepository.findById as jest.Mock).mockRejectedValue(
        new Error("DB Error"),
      );
      await expect(
        walletsService.verifyWalletOwnership(mockUserId, "wallet123"),
      ).rejects.toThrow("DB Error");
    });
  });

  describe("getCurrentUserWallets", () => {
    it("should return transformed wallets for authenticated user", async () => {
      (walletsRepository.findByUser as jest.Mock).mockResolvedValue([
        mockWallet,
      ]);
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });

      const result = await walletsService.getCurrentUserWallets();

      expect(result[0]).toEqual({
        ...mockWallet,
        changes: 0.25,
        changesAbs: 200,
        sinceLatestBallanceTs: expect.any(Object),
        latestWhistory: mockWallet.history[0],
      });
    });

    it("should handle wallets with insufficient history", async () => {
      const walletNoHistory = { ...mockWallet, history: [] };
      (walletsRepository.findByUser as jest.Mock).mockResolvedValue([
        walletNoHistory,
      ]);
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });

      const result = await walletsService.getCurrentUserWallets();

      expect(result[0].changes).toBeNull();
      expect(result[0].changesAbs).toBeNull();
      expect(result[0].latestWhistory).toBeNull();
    });

    it("should throw unauthorized error when no session", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      await expect(walletsService.getCurrentUserWallets()).rejects.toThrow(
        "Unauthorized!",
      );
    });
  });

  describe("getCurrentUserWallet", () => {
    it("should return wallet when found", async () => {
      (walletsRepository.findOne as jest.Mock).mockResolvedValue(mockWallet);
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
      const result = await walletsService.getCurrentUserWallet(mockWallet.id);
      expect(result).toEqual(mockWallet);
    });

    it("should throw not found error", async () => {
      (walletsRepository.findOne as jest.Mock).mockResolvedValue(null);
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
      await expect(
        walletsService.getCurrentUserWallet(mockWallet.id),
      ).rejects.toThrow("Wallet was not found!");
    });
  });

  describe("createCurrentUserWallet", () => {
    const createDto = { name: "New Wallet", currency: "EUR" };

    it("should create wallet", async () => {
      (walletsRepository.create as jest.Mock).mockResolvedValue({
        ...createDto,
        id: "new123",
      });
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
      const result = await walletsService.createCurrentUserWallet(createDto);
      expect(result).toEqual({ ...createDto, id: "new123" });
    });
  });

  describe("archiveSelfWallet", () => {
    it("should archive when authorized", async () => {
      (walletsRepository.findById as jest.Mock).mockResolvedValue(mockWallet);
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
      await walletsService.archiveSelfWallet(mockWallet.id);
      expect(walletsRepository.archive).toHaveBeenCalledWith(mockWallet.id);
    });

    it("should throw forbidden when not owner", async () => {
      (walletsRepository.findById as jest.Mock).mockResolvedValue({
        ...mockWallet,
        ownerId: "other",
      });
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
      await expect(
        walletsService.archiveSelfWallet(mockWallet.id),
      ).rejects.toThrow("Forbidden!");
    });
  });

  describe("unarchiveSelfWallet", () => {
    it("should unarchive when authorized", async () => {
      (walletsRepository.findById as jest.Mock).mockResolvedValue(mockWallet);
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
      await walletsService.unarchiveSelfWallet(mockWallet.id);
      expect(walletsRepository.unarchive).toHaveBeenCalledWith(mockWallet.id);
    });
  });

  describe("destroySelfWallet", () => {
    it("should destroy when authorized", async () => {
      (walletsRepository.findById as jest.Mock).mockResolvedValue(mockWallet);
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUserId } });
      await walletsService.destroySelfWallet(mockWallet.id);
      expect(walletsRepository.destroy).toHaveBeenCalledWith(mockWallet.id);
    });
  });
});
