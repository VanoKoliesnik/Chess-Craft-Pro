import { CoordinatesKey, ICoordinate, X, Y } from "@common/types";
import { genKey, parseKey } from "@common/utils";

import { Cell } from "@entities";

export interface IIsMoveForwardAvailableProps {
  cell: Cell;
  row: Cell[];
  delta: ICoordinate;
}

export class Coordinates {
  private readonly sizeX: X;
  private readonly sizeY: Y;

  constructor(sizeX: X, sizeY: Y) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
  }

  static getKey({ x, y }: ICoordinate): CoordinatesKey {
    return genKey(x, y) as CoordinatesKey;
  }

  static parseKey(coordinatesKey: CoordinatesKey): ICoordinate {
    const [x, y] = parseKey(coordinatesKey);

    return { x: Number(x), y: Number(y) };
  }

  static makeSetList(coordinates: ICoordinate[]): Set<CoordinatesKey> {
    return new Set(coordinates.map(Coordinates.getKey));
  }

  static makeMatrix(
    initialCoordinates: ICoordinate,
    destinationCoordinates: ICoordinate,
    excludedPoints: ICoordinate[] = []
  ): ICoordinate[] {
    const xStart = Math.min(initialCoordinates.x, destinationCoordinates.x);
    const xEnd = Math.max(initialCoordinates.x, destinationCoordinates.x);

    const yStart = Math.min(initialCoordinates.y, destinationCoordinates.y);
    const yEnd = Math.max(initialCoordinates.y, destinationCoordinates.y);

    const pointsToExclude = Coordinates.makeSetList(excludedPoints);

    const points: ICoordinate[] = [];

    for (let x = xStart; x <= xEnd; x++) {
      for (let y = yStart; y <= yEnd; y++) {
        if (!pointsToExclude.has(Coordinates.getKey({ x, y }))) {
          points.push({ x, y });
        }
      }
    }

    return points;
  }

  static delta(
    firstCoordinate: ICoordinate,
    secondCoordinate: ICoordinate
  ): ICoordinate {
    return {
      x: firstCoordinate.x - secondCoordinate.x,
      y: firstCoordinate.y - secondCoordinate.y,
    };
  }

  static deltaAbsolute(
    firstCoordinate: ICoordinate,
    secondCoordinate: ICoordinate
  ): ICoordinate {
    const { x, y } = this.delta(firstCoordinate, secondCoordinate);
    return { x: Math.abs(x), y: Math.abs(y) };
  }

  static areSame(
    firstCoordinate: ICoordinate,
    secondCoordinate: ICoordinate
  ): boolean {
    return (
      Coordinates.getKey(firstCoordinate) ===
      Coordinates.getKey(secondCoordinate)
    );
  }
}
