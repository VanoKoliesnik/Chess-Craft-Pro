import { createArray, genKey, isIn, pickRandomElement, randomNumber } from ".";

describe("Common::Utils", () => {
  describe("createArray", () => {
    it("should create an array of specified length with undefined values if no defaultValue is provided", () => {
      const result = createArray(3);

      expect(result).toEqual([undefined, undefined, undefined]);
    });

    it("should create an array of specified length with the default value", () => {
      const result = createArray(4, 5);

      expect(result).toEqual([5, 5, 5, 5]);
    });

    it("should create an empty array if length is 0", () => {
      const result = createArray(0);

      expect(result).toEqual([]);
    });

    it("should create an array with default objects", () => {
      const defaultObj = { key: "value" };
      const result = createArray(2, defaultObj);

      expect(result).toEqual([defaultObj, defaultObj]);
    });
  });

  describe("randomNumber", () => {
    it("should return a number between the specified range", () => {
      const result = randomNumber(10, 1);

      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });

    it("should return a number between the default range (0 to 10)", () => {
      const result = randomNumber();

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(10);
    });

    it("should return the same number if min and max are the same", () => {
      const result = randomNumber(5, 5);

      expect(result).toBe(5);
    });

    it("should return a number greater than or equal to min and less than or equal to max", () => {
      const min = 5;
      const max = 15;
      const result = randomNumber(max, min);

      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });
  });

  describe("genKey", () => {
    it("should generate a key by joining string and number arguments", () => {
      const result = genKey("luke", 2, "skywalker");

      expect(result).toBe("luke_2_skywalker");
    });

    it("should return an empty string if no arguments are provided", () => {
      const result = genKey();

      expect(result).toBe("");
    });

    it("should generate a key for single argument", () => {
      const result = genKey("single");

      expect(result).toBe("single");
    });

    it("should handle mixed types", () => {
      const result = genKey(1, "two", 3, "four");

      expect(result).toBe("1_two_3_four");
    });
  });

  describe("pickRandomElement", () => {
    it("should return a random element from the array", () => {
      const elements = [1, 2, 3, 4, 5];
      const result = pickRandomElement(elements);

      expect(elements).toContain(result);
    });

    it("should return undefined if the array is empty", () => {
      const elements: number[] = [];
      const result = pickRandomElement(elements);

      expect(result).toBeUndefined();
    });

    it("should return the only element if array has one element", () => {
      const elements = ["onlyElement"];
      const result = pickRandomElement(elements);

      expect(result).toBe("onlyElement");
    });
  });

  describe("isIn", () => {
    it("should return true if the property exists in the object", () => {
      const obj = { name: "R2D2", age: 30 };
      expect(isIn(obj, "name")).toBe(true);
      expect(isIn(obj, "age")).toBe(true);
    });

    it("should return false if the property does not exist in the object", () => {
      const obj = { name: "C3PO", age: 30 };
      // @ts-expect-error for test purpose
      expect(isIn(obj, "height")).toBe(false);
    });

    it("should return false for undefined or null objects", () => {
      expect(isIn(undefined as { name: string }, "name")).toBe(false);
      expect(isIn(null as { name: string }, "name")).toBe(false);
    });

    it("should work with an empty object", () => {
      const obj = {};
      // @ts-expect-error for test purpose
      expect(isIn(obj, "name")).toBe(false);
    });
  });
});
