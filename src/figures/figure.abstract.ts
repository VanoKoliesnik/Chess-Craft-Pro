import { randomUUID, UUID } from "node:crypto";
import { FigureMoveDirection } from "../common/enums";
import { CoordinatesKey, CoordinatesSet, ICoordinates } from "../common/types";

export abstract class Figure {
  readonly id: UUID;
  readonly portrait: string;

  abstract readonly moves: FigureMoveDirection[];
  abstract readonly cellsNumberInOneMove: number;

  constructor(portrait: string) {
    this.id = randomUUID();
    this.portrait = portrait;
  }

  isMoveAvailable(
    destinationCoordinates: ICoordinates,
    originalCoordinates: ICoordinates,
    boardSize: ICoordinates
  ): boolean {
    return this.getAvailableMovesSet(originalCoordinates, boardSize).has(
      `${destinationCoordinates.x}_${destinationCoordinates.y}`
    );
  }

  getAvailableMovesSet(
    originalCoordinates: ICoordinates,
    boardSize: ICoordinates
  ): CoordinatesSet {
    return new Set(
      this.getAvailableMoves(originalCoordinates, boardSize).map(
        ({ x, y }): CoordinatesKey => `${x}_${y}`
      )
    );
  }

  abstract getAvailableMoves(
    originalCoordinates: ICoordinates,
    boardSize: ICoordinates
  ): ICoordinates[];
}
