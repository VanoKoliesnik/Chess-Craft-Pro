import { BOARD_COLUMN_NAMES, BOARD_ROW_NAMES } from "@common/constants";
import { Coordinates } from "@common/shared";
import {
  CoordinatesKey,
  CoordinatesSet,
  ICoordinate,
  ISizeCoordinate,
  PlayersMap,
} from "@common/types";

import { Cell } from "@entities";

export abstract class Rules {
  protected readonly coordinates: Coordinates;

  abstract readonly name: string;

  constructor({ x, y }: ISizeCoordinate) {
    this.coordinates = new Coordinates(x, y);
  }

  abstract spawnPlayers(): PlayersMap;
  // abstract spawnFigures(players: PlayersMap): void; // todo: implement
  abstract getCellAvailableMoves(cell: Cell): ICoordinate[];

  isMoveAvailable(cell: Cell, destinationCoordinates: ICoordinate): boolean {
    return this.getCellAvailableMovesSet(cell).has(
      `${destinationCoordinates.x}_${destinationCoordinates.y}`
    );
  }

  getCellsAvailableMoves(cells: Cell[]): Map<CoordinatesKey, ICoordinate[]> {
    const cellsAvailableMoves = new Map<CoordinatesKey, ICoordinate[]>();

    for (const cell of cells) {
      cellsAvailableMoves.set(
        Coordinates.getKey(cell.coordinates),
        this.getCellAvailableMoves(cell)
      );
    }

    return cellsAvailableMoves;
  }

  getCellAvailableMovesSet(cell: Cell): CoordinatesSet {
    return new Set(
      this.getCellAvailableMoves(cell).map(
        ({ x, y }): CoordinatesKey => `${x}_${y}`
      )
    );
  }

  getColumnsNames(): string[] {
    return BOARD_COLUMN_NAMES;
  }

  getRowsNames(): string[] {
    return BOARD_ROW_NAMES;
  }
}
