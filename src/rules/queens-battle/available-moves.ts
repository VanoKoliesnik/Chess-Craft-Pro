import { CellType } from "@common/enums";
import { Coordinates, DiagonalCoordinates } from "@common/shared";
import { ICoordinate } from "@common/types";

import { Board, Cell } from "@entities";

type Parameters = {
  maxCellsToJumpOver: number;
};

export class QueensBattleRulesAvailableMoves {
  private readonly maxCellsToJumpOver: number;

  constructor({ maxCellsToJumpOver }: Parameters) {
    this.maxCellsToJumpOver = maxCellsToJumpOver;
  }

  getAvailableHorizontalMoves(initialCoordinates: ICoordinate): ICoordinate[] {
    const coordinatesToLeft = Coordinates.makeMatrix(
      initialCoordinates,
      {
        x: 0,
        y: initialCoordinates.y,
      },
      [initialCoordinates]
    ).reverse();

    const coordinatesToRight = Coordinates.makeMatrix(
      initialCoordinates,
      {
        x: Board.getInstance().maxX,
        y: initialCoordinates.y,
      },
      [initialCoordinates]
    );

    return []
      .concat(this.getAvailableCoordinatesRange(coordinatesToLeft))
      .concat(this.getAvailableCoordinatesRange(coordinatesToRight));
  }

  getAvailableVerticalMoves(initialCoordinates: ICoordinate): ICoordinate[] {
    const coordinatesToTop = Coordinates.makeMatrix(
      initialCoordinates,
      {
        x: initialCoordinates.x,
        y: 0,
      },
      [initialCoordinates]
    ).reverse();

    const coordinatesToBottom = Coordinates.makeMatrix(
      initialCoordinates,
      {
        y: Board.getInstance().maxY,
        x: initialCoordinates.x,
      },
      [initialCoordinates]
    );

    return []
      .concat(this.getAvailableCoordinatesRange(coordinatesToTop))
      .concat(this.getAvailableCoordinatesRange(coordinatesToBottom));
  }

  getAvailableDiagonalMoves(initialCoordinates: ICoordinate): ICoordinate[] {
    const upperLeftPoints =
      DiagonalCoordinates.getUpperLeftPoints(initialCoordinates);

    const upperRightPoints =
      DiagonalCoordinates.getUpperRightPoints(initialCoordinates);

    const lowerLeftPoints =
      DiagonalCoordinates.getLowerLeftPoints(initialCoordinates);

    const lowerRightPoints =
      DiagonalCoordinates.getLowerRightPoints(initialCoordinates);

    return []
      .concat(this.getAvailableCoordinatesRange(upperLeftPoints))
      .concat(this.getAvailableCoordinatesRange(upperRightPoints))
      .concat(this.getAvailableCoordinatesRange(lowerLeftPoints))
      .concat(this.getAvailableCoordinatesRange(lowerRightPoints));
  }

  private getAvailableCoordinatesRange(
    possibleCoordinatesToMove: ICoordinate[]
  ): ICoordinate[] {
    let cellsToJumpOver = 0;

    const availableToMoveCoordinates: ICoordinate[] = [];

    const row: Cell[] = Board.getInstance().getCells(possibleCoordinatesToMove);

    for (const cell of row) {
      if (cell.type === CellType.Black) {
        cellsToJumpOver++;
        continue;
      }

      if (cellsToJumpOver > this.maxCellsToJumpOver) {
        continue;
      }

      cellsToJumpOver = 0;

      availableToMoveCoordinates.push(cell.coordinates);
    }

    return availableToMoveCoordinates;
  }
}
