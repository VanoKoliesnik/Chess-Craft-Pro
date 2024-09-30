import { CellType } from "@common/enums";

import { Board, Cell } from "@entities";
import { Rules } from "@rules";

export class DebugEngine {
  private readonly rules: Rules;

  constructor(rules: Rules) {
    this.rules = rules;
  }

  highlightAvailableMoves(): void {
    const board = Board.getInstance();

    board.iterateThroughBoard((cell: Cell) => {
      cell.setType = CellType.White;
    });

    const availableMoves = this.rules.getCellsAvailableMoves(
      Array.from(board.occupiedCells.values())
    );

    const cellsToHighlight: Cell[] = [];

    for (const [, coordinates] of availableMoves) {
      cellsToHighlight.push(...board.getCells(coordinates));
    }

    for (const cell of cellsToHighlight) {
      cell.setType = CellType.Blue;
    }
  }
}
