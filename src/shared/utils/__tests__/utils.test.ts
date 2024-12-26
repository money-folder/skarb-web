import {
  generateNumberArray,
  generatePseudoUUID,
  getLocalISOString,
  replacePlaceholders,
} from "../utils";

describe("generatePseudoUUID", () => {
  it("should generate a UUID in the correct format", () => {
    const uuid = generatePseudoUUID();
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });
});

describe("getLocalISOString", () => {
  it("should format date correctly", () => {
    const testDate = new Date(2024, 0, 15, 14, 30); // Jan 15, 2024, 14:30
    const result = getLocalISOString(testDate);
    expect(result).toBe("2024-01-15T14:30");
  });

  it("should pad single digit values with zeros", () => {
    const testDate = new Date(2024, 3, 5, 9, 5); // Apr 5, 2024, 09:05
    const result = getLocalISOString(testDate);
    expect(result).toBe("2024-04-05T09:05");
  });

  it("should handle December correctly", () => {
    const testDate = new Date(2024, 11, 31, 23, 59); // Dec 31, 2024, 23:59
    const result = getLocalISOString(testDate);
    expect(result).toBe("2024-12-31T23:59");
  });
});

describe("generateNumberArray", () => {
  it("should generate array with integer step", () => {
    expect(generateNumberArray(1, 5, 1)).toEqual([1, 2, 3, 4, 5]);
  });

  it("should generate array with decimal step", () => {
    expect(generateNumberArray(0, 1, 0.5)).toEqual([0, 0.5, 1]);
  });

  it("should include max value if not hit by step", () => {
    expect(generateNumberArray(0, 10, 3)).toEqual([0, 3, 6, 9, 10]);
  });

  it("should handle single value range", () => {
    expect(generateNumberArray(5, 5, 1)).toEqual([5]);
  });

  it("should handle negative numbers", () => {
    expect(generateNumberArray(-5, 0, 2)).toEqual([-5, -3, -1, 0]);
  });
});

describe("replacePlaceholders", () => {
  it("should replace all placeholders with corresponding values", () => {
    const template = "Hello {{name}}, welcome to {{place}}!";
    const replacements = {
      name: "John",
      place: "Paris",
    };
    expect(replacePlaceholders(template, replacements)).toBe(
      "Hello John, welcome to Paris!",
    );
  });

  it("should leave unmatched placeholders unchanged", () => {
    const template = "Hello {{name}}, welcome to {{place}}!";
    const replacements = {
      name: "John",
    };
    expect(replacePlaceholders(template, replacements)).toBe(
      "Hello John, welcome to {{place}}!",
    );
  });

  it("should handle spaces in placeholder syntax", () => {
    const template = "Hello {{ name }}, welcome to {{  place  }}!";
    const replacements = {
      name: "John",
      place: "Paris",
    };
    expect(replacePlaceholders(template, replacements)).toBe(
      "Hello John, welcome to Paris!",
    );
  });

  it("should handle empty replacements object", () => {
    const template = "Hello {{name}}!";
    const replacements = {};
    expect(replacePlaceholders(template, replacements)).toBe("Hello {{name}}!");
  });

  it("should handle template with no placeholders", () => {
    const template = "Hello World!";
    const replacements = { name: "John" };
    expect(replacePlaceholders(template, replacements)).toBe("Hello World!");
  });
});
