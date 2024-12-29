import {
  calculateDateDifference,
  DateDifference,
  formatDateDifference,
  formatDateDifferenceBe,
  formatDateDifferenceEn,
  isValidDate,
} from "../time-utils";

describe("calculateDateDifference", () => {
  it("should calculate difference between two dates correctly", () => {
    const date1 = new Date("2024-01-01T00:00:00");
    const date2 = new Date("2025-03-15T12:30:45");

    const result = calculateDateDifference(date1, date2);

    expect(result).toEqual({
      years: 1,
      months: 2,
      days: 14,
      hours: 12,
      minutes: 30,
      seconds: 45,
    });
  });

  it("should handle dates in reverse order", () => {
    const date1 = new Date("2025-01-01T00:00:00");
    const date2 = new Date("2024-01-01T00:00:00");

    const result = calculateDateDifference(date1, date2);

    expect(result).toEqual({
      years: 1,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });

  it("should calculate small time differences correctly", () => {
    const date1 = new Date("2024-01-01T10:00:00");
    const date2 = new Date("2024-01-01T10:00:30");

    const result = calculateDateDifference(date1, date2);

    expect(result).toEqual({
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 30,
    });
  });
});

describe("formatDateDifferenceEn", () => {
  it("should format full date difference correctly", () => {
    const diff: DateDifference = {
      years: 1,
      months: 2,
      days: 3,
      hours: 4,
      minutes: 5,
      seconds: 6,
    };

    const result = formatDateDifferenceEn(diff);
    expect(result).toBe("1 year, 2 months, 3 days, 4 hours, 5 mins, 6 seconds");
  });

  it("should handle singular forms correctly", () => {
    const diff: DateDifference = {
      years: 1,
      months: 1,
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
    };

    const result = formatDateDifferenceEn(diff);
    expect(result).toBe("1 year, 1 month, 1 day, 1 hour, 1 min, 1 second");
  });

  it("should handle empty difference", () => {
    const diff: Partial<DateDifference> = {};
    const result = formatDateDifferenceEn(diff);
    expect(result).toBe("Just now!");
  });

  it("should skip zero values", () => {
    const diff: DateDifference = {
      years: 0,
      months: 1,
      days: 0,
      hours: 2,
      minutes: 0,
      seconds: 3,
    };

    const result = formatDateDifferenceEn(diff);
    expect(result).toBe("1 month, 2 hours, 3 seconds");
  });
});

describe("formatDateDifferenceBe", () => {
  it("should format full date difference correctly in Belarusian", () => {
    const diff: DateDifference = {
      years: 2,
      months: 2,
      days: 2,
      hours: 2,
      minutes: 2,
      seconds: 2,
    };

    const result = formatDateDifferenceBe(diff);
    expect(result).toBe(
      "2 годы, 2 месяцы, 2 дні, 2 гадзіны, 2 хвіліны, 2 секунды",
    );
  });

  it("should handle singular forms correctly in Belarusian", () => {
    const diff: DateDifference = {
      years: 1,
      months: 1,
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
    };

    const result = formatDateDifferenceBe(diff);
    expect(result).toBe(
      "1 год, 1 месяц, 1 дзень, 1 гадзіна, 1 хвіліна, 1 секунда",
    );
  });

  it("should handle empty difference in Belarusian", () => {
    const diff: Partial<DateDifference> = {};
    const result = formatDateDifferenceBe(diff);
    expect(result).toBe("Толькі што!");
  });
});

describe("formatDateDifference", () => {
  const diff: DateDifference = {
    years: 1,
    months: 2,
    days: 3,
    hours: 4,
    minutes: 5,
    seconds: 6,
  };

  it('should use English formatting for "en" locale', () => {
    const result = formatDateDifference(diff, "en");
    expect(result).toBe("1 year, 2 months, 3 days, 4 hours, 5 mins, 6 seconds");
  });

  it('should use Belarusian formatting for "be" locale', () => {
    const result = formatDateDifference(diff, "be");
    expect(result).toBe(
      "1 год, 2 месяцы, 3 дні, 4 гадзіны, 5 хвіліны, 6 секунды",
    );
  });

  it("should default to English for unknown locales", () => {
    const result = formatDateDifference(diff, "unknown");
    expect(result).toBe("1 year, 2 months, 3 days, 4 hours, 5 mins, 6 seconds");
  });
});

describe("isValidDate", () => {
  test("valid dates", () => {
    expect(isValidDate(new Date("2024-01-01"))).toBe(true);
    expect(isValidDate(new Date())).toBe(true);
    expect(isValidDate(new Date("1900-01-01"))).toBe(true);
  });

  test("invalid dates", () => {
    expect(isValidDate(new Date("invalid"))).toBe(false);
    expect(isValidDate(new Date("2024-13-01"))).toBe(false);
  });

  test("edge cases", () => {
    expect(isValidDate(new Date(NaN))).toBe(false);
    expect(isValidDate(new Date(""))).toBe(false);
  });
});
