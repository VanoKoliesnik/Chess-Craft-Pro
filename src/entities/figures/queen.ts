import { FigureType } from "@common/enums";

import { Figure } from "./figure.abstract";

export class Queen extends Figure {
  readonly type = FigureType.Queen;
}
