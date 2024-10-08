import { CellType } from "@common/enums";

import { Cell, Holocron } from "@entities";
import { Rules } from "@rules";

type DebugConfig = {
  rules: Rules;
};

export class DebugEngine {
  private readonly rules: Rules;

  constructor({ rules }: DebugConfig) {
    this.rules = rules;
  }

  highlightAvailableMoves(): void {
    const holocron = Holocron.getInstance();

    holocron.iterateBoard({
      cellCallback: (cell: Cell) => {
        if (cell.type !== CellType.Black) {
          cell.setType = CellType.White;
        }
      },
    });

    const availableMoves = this.rules.getCellsAvailableMoves(
      holocron.occupiedCells
    );

    const cellsToHighlight: Cell[] = [];

    for (const [, coordinates] of availableMoves) {
      cellsToHighlight.push(...holocron.getCells({ coordinates }));
    }

    for (const cell of cellsToHighlight) {
      cell.setType = CellType.Blue;
    }
  }
}
