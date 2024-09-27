import { FigureType } from "@common/enums";
import { ICoordinate, ISizeCoordinate } from "@common/types";

import { Cell } from "@entities";
import { Rules } from "@rules";


import { QueensBattleRulesAvailableMoves } from "./available-moves";

export class QueensBattleRules extends Rules {
  readonly name = "Queens Battle";

  private readonly maxCellsToJumpOver: number;
  private readonly availableMoves: QueensBattleRulesAvailableMoves;

  constructor(boardSize: ISizeCoordinate) {
    super(boardSize);

    this.maxCellsToJumpOver = 1;
    this.availableMoves = new QueensBattleRulesAvailableMoves({
      maxCellsToJumpOver: this.maxCellsToJumpOver,
    });
  }

  getAvailableMoves(cell: Cell): ICoordinate[] {
    if (!cell.figure) {
      return [];
    }

    if (cell.figure.type !== FigureType.Queen) {
      return [];
    }

    return []
      .concat(this.availableMoves.getAvailableHorizontalMoves(cell.coordinates))
      .concat(this.availableMoves.getAvailableVerticalMoves(cell.coordinates))
      .concat(this.availableMoves.getAvailableDiagonalMoves(cell.coordinates));
  }
}
