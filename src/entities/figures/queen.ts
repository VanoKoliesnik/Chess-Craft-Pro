import { FigureMoveDirection, FigureType } from "@common/enums";
import { Figure } from "./figure.abstract";

export class Queen extends Figure {
  readonly moves = [
    FigureMoveDirection.Horizontal,
    FigureMoveDirection.Vertical,
    FigureMoveDirection.Diagonal,
  ];

  readonly type = FigureType.Queen;
  readonly maxDistance = Infinity;
}
