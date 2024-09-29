import { ICoordinate } from "@common/types";

import { Coordinates } from "./coordinates";

describe("Common::Shared::Coordinates", () => {
  let genKeySpy: jest.SpyInstance;
  let getKeySpy: jest.SpyInstance;
  let makeSetListSpy: jest.SpyInstance;
  let deltaSpy: jest.SpyInstance;

  beforeEach(() => {
    genKeySpy = jest.spyOn(require("@common/utils"), "genKey");
    getKeySpy = jest.spyOn(Coordinates, "getKey");
    makeSetListSpy = jest.spyOn(Coordinates, "makeSetList");
    deltaSpy = jest.spyOn(Coordinates, "delta");
  });

  afterEach(() => {
    const spies = [genKeySpy, getKeySpy, makeSetListSpy, deltaSpy];

    for (const spy of spies) {
      spy.mockRestore();
    }
  });

  describe("getKey", () => {
    it("should create proper coordinates key", () => {
      const expectedCoordinates: ICoordinate = { x: 23, y: 76 };

      const inputCoordinates: ICoordinate = { ...expectedCoordinates };

      const key = Coordinates.getKey(inputCoordinates);

      expect(key).toBe(`${expectedCoordinates.x}_${expectedCoordinates.y}`);
      expect(inputCoordinates).toEqual(expectedCoordinates);
      expect(genKeySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("makeSetList", () => {
    it("should create a Set of CoordinatesKey from an array of coordinates", () => {
      const coordinates = [
        { x: 1, y: 2 },
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ];

      const expectedSet = new Set(["1_2", "3_4"]);
      const result = Coordinates.makeSetList(coordinates);

      expect(result).toEqual(expectedSet);
      expect(result.size).toBe(2);
      expect(getKeySpy).toHaveBeenCalledTimes(3);
    });

    it("should return an empty Set for an empty array", () => {
      const coordinates: ICoordinate[] = [];
      const expectedSet = new Set();

      const result = Coordinates.makeSetList(coordinates);

      expect(result).toEqual(expectedSet);
      expect(result.size).toBe(0);
      expect(getKeySpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("makeMatrix", () => {
    it("should create a matrix of coordinates between two points from upper left to lower right", () => {
      const initialCoordinates: ICoordinate = { x: 1, y: 1 };
      const destinationCoordinates: ICoordinate = { x: 3, y: 3 };

      const expectedPoints: ICoordinate[] = [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 1 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
      ];

      const result = Coordinates.makeMatrix(
        initialCoordinates,
        destinationCoordinates
      );

      expect(result).toEqual(expectedPoints);
      expect(makeSetListSpy).toHaveBeenCalledTimes(1);
      expect(getKeySpy).toHaveBeenCalledTimes(9);
    });

    it("should create a matrix of coordinates between two points from lower right to upper left", () => {
      const initialCoordinates: ICoordinate = { x: 3, y: 3 };
      const destinationCoordinates: ICoordinate = { x: 1, y: 1 };

      const expectedPoints: ICoordinate[] = [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 1 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
      ];

      const result = Coordinates.makeMatrix(
        initialCoordinates,
        destinationCoordinates
      );

      expect(result).toEqual(expectedPoints);
      expect(makeSetListSpy).toHaveBeenCalledTimes(1);
      expect(getKeySpy).toHaveBeenCalledTimes(9);
    });

    it("should handle negative coordinates matrix", () => {
      const initialCoordinates: ICoordinate = { x: 1, y: 1 };
      const destinationCoordinates: ICoordinate = { x: -1, y: -1 };

      const expectedPoints: ICoordinate[] = [
        { x: -1, y: -1 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: -1 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: -1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
      ];

      const result = Coordinates.makeMatrix(
        initialCoordinates,
        destinationCoordinates
      );

      expect(result).toEqual(expectedPoints);
      expect(makeSetListSpy).toHaveBeenCalledTimes(1);
      expect(getKeySpy).toHaveBeenCalledTimes(9);
    });

    it("should exclude points", () => {
      const initialCoordinates: ICoordinate = { x: 1, y: 1 };
      const destinationCoordinates: ICoordinate = { x: 3, y: 3 };
      const excludedCoordinates: ICoordinate[] = [
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 3, y: 1 },
      ];

      const expectedPoints: ICoordinate[] = [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
      ];

      const result = Coordinates.makeMatrix(
        initialCoordinates,
        destinationCoordinates,
        excludedCoordinates
      );

      expect(result).toEqual(expectedPoints);
      expect(makeSetListSpy).toHaveBeenCalledTimes(1);
      expect(getKeySpy).toHaveBeenCalledTimes(12);
    });

    it("should create a matrix with one point", () => {
      const initialCoordinates: ICoordinate = { x: 1, y: 1 };
      const destinationCoordinates: ICoordinate = { x: 1, y: 1 };

      const expectedPoints: ICoordinate[] = [{ x: 1, y: 1 }];

      const result = Coordinates.makeMatrix(
        initialCoordinates,
        destinationCoordinates
      );

      expect(result).toEqual(expectedPoints);
      expect(makeSetListSpy).toHaveBeenCalledTimes(1);
      expect(getKeySpy).toHaveBeenCalledTimes(1);
    });

    describe("delta", () => {
      it("should calculate the difference between two coordinates", () => {
        const firstCoordinate: ICoordinate = { x: 5, y: 7 };
        const secondCoordinate: ICoordinate = { x: 2, y: 3 };

        const expectedDelta: ICoordinate = { x: 3, y: 4 };
        const result = Coordinates.delta(firstCoordinate, secondCoordinate);

        expect(result).toEqual(expectedDelta);
      });

      it("should handle negative results correctly", () => {
        const firstCoordinate: ICoordinate = { x: 2, y: 3 };
        const secondCoordinate: ICoordinate = { x: 5, y: 7 };

        const expectedDelta: ICoordinate = { x: -3, y: -4 };
        const result = Coordinates.delta(firstCoordinate, secondCoordinate);

        expect(result).toEqual(expectedDelta);
      });
    });

    describe("deltaAbsolute", () => {
      it("should calculate the absolute difference between two coordinates", () => {
        const firstCoordinate: ICoordinate = { x: 5, y: 7 };
        const secondCoordinate: ICoordinate = { x: 2, y: 3 };

        const expectedAbsoluteDelta: ICoordinate = { x: 3, y: 4 };
        const result = Coordinates.deltaAbsolute(
          firstCoordinate,
          secondCoordinate
        );

        expect(result).toEqual(expectedAbsoluteDelta);
        expect(deltaSpy).toHaveBeenCalledTimes(1);
      });

      it("should handle negative results correctly", () => {
        const firstCoordinate: ICoordinate = { x: 2, y: 3 };
        const secondCoordinate: ICoordinate = { x: 5, y: 7 };

        const expectedAbsoluteDelta: ICoordinate = { x: 3, y: 4 };
        const result = Coordinates.deltaAbsolute(
          firstCoordinate,
          secondCoordinate
        );

        expect(result).toEqual(expectedAbsoluteDelta);
        expect(deltaSpy).toHaveBeenCalledTimes(1);
      });

      it("should handle the same coordinates", () => {
        const firstCoordinate: ICoordinate = { x: 5, y: 5 };
        const secondCoordinate: ICoordinate = { x: 5, y: 5 };

        const expectedAbsoluteDelta: ICoordinate = { x: 0, y: 0 };
        const result = Coordinates.deltaAbsolute(
          firstCoordinate,
          secondCoordinate
        );

        expect(result).toEqual(expectedAbsoluteDelta);
        expect(deltaSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("areSame", () => {
      it("should return true for identical coordinates", () => {
        const firstCoordinate: ICoordinate = { x: 5, y: 10 };
        const secondCoordinate: ICoordinate = { x: 5, y: 10 };

        const result = Coordinates.areSame(firstCoordinate, secondCoordinate);
        expect(result).toBe(true);
        expect(getKeySpy).toHaveBeenCalledTimes(2);
      });

      it("should return false for different coordinates", () => {
        const firstCoordinate: ICoordinate = { x: 5, y: 10 };
        const secondCoordinate: ICoordinate = { x: 3, y: 10 };

        const result = Coordinates.areSame(firstCoordinate, secondCoordinate);
        expect(result).toBe(false);
        expect(getKeySpy).toHaveBeenCalledTimes(2);
      });

      it("should return false for different y values", () => {
        const firstCoordinate: ICoordinate = { x: 5, y: 10 };
        const secondCoordinate: ICoordinate = { x: 5, y: 12 };

        const result = Coordinates.areSame(firstCoordinate, secondCoordinate);
        expect(result).toBe(false);
        expect(getKeySpy).toHaveBeenCalledTimes(2);
      });

      it("should return false when coordinates are in different order but same values", () => {
        const firstCoordinate: ICoordinate = { x: 5, y: 10 };
        const secondCoordinate: ICoordinate = { x: 10, y: 5 };

        const result = Coordinates.areSame(firstCoordinate, secondCoordinate);
        expect(result).toBe(false);
        expect(getKeySpy).toHaveBeenCalledTimes(2);
      });
    });
  });
});
