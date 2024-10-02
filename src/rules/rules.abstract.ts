import { BOARD_COLUMN_NAMES, BOARD_ROW_NAMES } from "@common/constants";
import { Coordinates } from "@common/shared";
import { CoordinatesKey, CoordinatesSet, ICoordinate } from "@common/types";

import { Cell, Holocron, Player } from "@entities";

export abstract class Rules {
  protected readonly holocron: Holocron;

  abstract readonly name: string;

  abstract prepare(): void;
  abstract nextMove(): void;

  abstract spawnPlayers(): Player[];
  abstract spawnFigures(players: Player[]): void;
  abstract getCellAvailableMoves(cell: Cell): ICoordinate[];
  abstract checkIfCanAcceptFigure(cell: Cell): boolean;

  constructor() {
    this.holocron = Holocron.getInstance();
  }

  isMoveAvailable(cell: Cell, destinationCoordinates: ICoordinate): boolean {
    return this.getCellAvailableMovesSet(cell).has(
      `${destinationCoordinates.x}_${destinationCoordinates.y}`
    );
  }

  getAvailableMoves(coordinates: ICoordinate): ICoordinate[] {
    return this.getCellAvailableMoves(
      Holocron.getInstance().getCell({ coordinates })
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
