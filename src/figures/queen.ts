import { FigureMoveDirection } from "../common/enums";
import { Coordinates } from "../common/shared";
import { ICoordinates } from "../common/types";
import { Figure } from "./figure.abstract";

export class Queen extends Figure {
  readonly moves = [
    FigureMoveDirection.Horizontal,
    FigureMoveDirection.Vertical,
    FigureMoveDirection.Diagonal,
  ];

  readonly cellsNumberInOneMove = Infinity;

  getAvailableMoves(
    originalCoordinates: ICoordinates,
    { x: boardSizeX, y: boardSizeY }: ICoordinates
  ): ICoordinates[] {
    const coordinates = new Coordinates(boardSizeX, boardSizeY);

    const availableMoves = coordinates
      .getHorizontalMoves(originalCoordinates, this.cellsNumberInOneMove)
      .concat(
        coordinates.getVerticalMoves(
          originalCoordinates,
          this.cellsNumberInOneMove
        )
      )
      .concat(
        coordinates.getDiagonalMoves(
          originalCoordinates,
          this.cellsNumberInOneMove
        )
      );

    return availableMoves;
  }
}
