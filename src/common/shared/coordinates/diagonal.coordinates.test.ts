import { ICoordinate } from "@common/types";

import { DiagonalCoordinates } from "./diagonal.coordinates";

jest.mock("@entities", () => ({
  Board: {
    getInstance: jest.fn().mockReturnValue({
      minX: 0,
      minY: 0,
      maxX: 7,
      maxY: 7,
    }),
  },
}));

describe("Common::Shared::DiagonalCoordinates", () => {
  const initialCoordinates: ICoordinate = { x: 3, y: 3 };

  let upperLeftSpy: jest.SpyInstance;
  let lowerLeftSpy: jest.SpyInstance;
  let upperRightSpy: jest.SpyInstance;
  let lowerRightSpy: jest.SpyInstance;

  beforeEach(() => {
    upperLeftSpy = jest.spyOn(DiagonalCoordinates, "getUpperLeftPoints");
    lowerLeftSpy = jest.spyOn(DiagonalCoordinates, "getLowerLeftPoints");
    upperRightSpy = jest.spyOn(DiagonalCoordinates, "getUpperRightPoints");
    lowerRightSpy = jest.spyOn(DiagonalCoordinates, "getLowerRightPoints");
  });

  afterEach(() => {
    upperLeftSpy.mockRestore();
    lowerLeftSpy.mockRestore();
    upperRightSpy.mockRestore();
    lowerRightSpy.mockRestore();
  });

  describe("getPoints", () => {
    test("should return all diagonal points", () => {
      const points = DiagonalCoordinates.getPoints(initialCoordinates);

      expect(points).toEqual([
        { x: 2, y: 2 },
        { x: 1, y: 1 },
        { x: 0, y: 0 },
        { x: 4, y: 2 },
        { x: 5, y: 1 },
        { x: 6, y: 0 },
        { x: 2, y: 4 },
        { x: 1, y: 5 },
        { x: 0, y: 6 },
        { x: 4, y: 4 },
        { x: 5, y: 5 },
        { x: 6, y: 6 },
        { x: 7, y: 7 },
      ]);
      expect(upperLeftSpy).toHaveBeenCalledTimes(1);
      expect(lowerLeftSpy).toHaveBeenCalledTimes(1);
      expect(upperRightSpy).toHaveBeenCalledTimes(1);
      expect(lowerRightSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("getUpperLeftPoints", () => {
    test("should return upper left diagonal points", () => {
      const points = DiagonalCoordinates.getUpperLeftPoints(initialCoordinates);

      expect(points).toEqual([
        { x: 2, y: 2 },
        { x: 1, y: 1 },
        { x: 0, y: 0 },
      ]);
    });
  });

  describe("getLowerLeftPoints", () => {
    test("should return lower left diagonal points", () => {
      const points = DiagonalCoordinates.getLowerLeftPoints(initialCoordinates);

      expect(points).toEqual([
        { x: 2, y: 4 },
        { x: 1, y: 5 },
        { x: 0, y: 6 },
      ]);
    });
  });

  describe("getUpperRightPoints", () => {
    test("should return upper right diagonal points", () => {
      const points =
        DiagonalCoordinates.getUpperRightPoints(initialCoordinates);

      expect(points).toEqual([
        { x: 4, y: 2 },
        { x: 5, y: 1 },
        { x: 6, y: 0 },
      ]);
    });
  });

  describe("getLowerRightPoints", () => {
    test("should return lower right diagonal points", () => {
      const points =
        DiagonalCoordinates.getLowerRightPoints(initialCoordinates);

      expect(points).toEqual([
        { x: 4, y: 4 },
        { x: 5, y: 5 },
        { x: 6, y: 6 },
        { x: 7, y: 7 },
      ]);
    });
  });
});
