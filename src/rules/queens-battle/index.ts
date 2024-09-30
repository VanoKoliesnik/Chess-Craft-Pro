import { CellType, FigureColor, FigureType } from "@common/enums";
import { ICoordinate, ISizeCoordinate, PlayersMap } from "@common/types";

import { Cell, Player } from "@entities";

import { Rules } from "../rules.abstract";
import { QueensBattleRulesAvailableMoves } from "./available-moves";

export class QueensBattleRules extends Rules {
  readonly name = "Queens Battle";

  private readonly maxCellsToJumpOver: number;
  private readonly availableMoves: QueensBattleRulesAvailableMoves;

  private readonly cellsToSpawnFigures: SetIterator<ICoordinate>;

  constructor(boardSize: ISizeCoordinate) {
    super(boardSize);

    this.maxCellsToJumpOver = 1;
    this.availableMoves = new QueensBattleRulesAvailableMoves({
      maxCellsToJumpOver: this.maxCellsToJumpOver,
    });

    this.cellsToSpawnFigures = new Set([
      { x: 3, y: 0 },
      { x: 4, y: boardSize.y },
    ]).values();
  }

  spawnPlayers(): PlayersMap {
    const darthVader = new Player({ figuresColor: FigureColor.Black });
    const lukeSkywalker = new Player({ figuresColor: FigureColor.White });

    return new Map([
      [darthVader.id, darthVader],
      [lukeSkywalker.id, lukeSkywalker],
    ]);
  }

  checkIfCanAcceptFigure(cell: Cell): boolean {
    return cell.isEmpty && cell.type !== CellType.Black;
  }

  getCellAvailableMoves(cell: Cell): ICoordinate[] {
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
