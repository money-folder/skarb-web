import { isValidDate } from "../time-utils";

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
