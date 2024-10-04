import { BOARD_COLUMN_NAMES, BOARD_ROW_NAMES } from "@common/constants";
import {
  AppEventEmitter,
  Coordinates,
  EventEmitter,
  EventName,
} from "@common/shared";
import {
  CoordinatesKey,
  CoordinatesSet,
  ICoordinate,
  WinConditionsResult,
} from "@common/types";

import { Cell, Holocron, Player } from "@entities";

export abstract class Rules {
  abstract readonly name: string;

  abstract prepare(): void;
  protected abstract nextMove(): void;

  abstract spawnPlayers(): void;
  abstract spawnFigures(players: Player[]): void;
  abstract getCellAvailableMoves(cell: Cell): ICoordinate[];
  abstract checkIfCanAcceptFigure(cell: Cell): boolean;
  abstract checkWinningConditions(): WinConditionsResult;
  abstract drawStatistics(): string;

  protected readonly eventEmitter: EventEmitter;

  protected winner: Player;

  constructor() {
    this.eventEmitter = AppEventEmitter.getInstance();
  }

  updateState() {
    this.nextMove();

    const winningResultCheck = this.checkWinningConditions();

    if (winningResultCheck.hasSomeoneWon) {
      this.winner = winningResultCheck.player;
      this.finishGame();
    }
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

  finishGame() {
    this.eventEmitter.emit(EventName.GameFinished, this.winner);
  }
}
