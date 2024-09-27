
import { Coordinates } from "@common/shared";
import {
  CoordinatesKey,
  CoordinatesSet,
  ICoordinate,
  ISizeCoordinate,
} from "@common/types";

import { Cell } from "@entities";

export abstract class Rules {
  protected readonly coordinates: Coordinates;

  abstract readonly name: string;

  constructor({ x, y }: ISizeCoordinate) {
    this.coordinates = new Coordinates(x, y);
  }

  isMoveAvailable(cell: Cell, destinationCoordinates: ICoordinate): boolean {
    return this.getAvailableMovesSet(cell).has(
      `${destinationCoordinates.x}_${destinationCoordinates.y}`
    );
  }

  getAvailableMovesSet(cell: Cell): CoordinatesSet {
    return new Set(
      this.getAvailableMoves(cell).map(
        ({ x, y }): CoordinatesKey => `${x}_${y}`
      )
    );
  }

  abstract getAvailableMoves(cell: Cell): ICoordinate[];
}
