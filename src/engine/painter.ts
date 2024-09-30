import CliTable from "cli-table3";

import { Board } from "@entities";
import { Rules } from "@rules";

import { DebugEngine } from "./debug";
import { RenderEngine } from "./render";

export class PainterEngine {
  private readonly board: Board;
  private readonly rules: Rules;
  private readonly debugEngine: DebugEngine;

  constructor(rules: Rules) {
    this.board = Board.getInstance();
    this.rules = rules;
    this.debugEngine = new DebugEngine(this.rules);

    new RenderEngine(this.draw.bind(this));
  }

  private draw(): string {
    this.debugEngine.highlightAvailableMoves();

    return `
    ${this.drawBoard()}

    ${this.drawStatistics()}`;
  }

  private drawBoard(): string {
    const table = new CliTable({
      head: ["", ...this.rules.getColumnsNames()],
    });

    const rowsNames = this.rules.getRowsNames();

    for (const row of this.board.getBoard) {
      table.push([
        rowsNames[row[0].coordinates.y],
        ...row.map((cell) => {
          return `${cell.color}${cell.color}${cell.color}\n${cell.color}${
            cell.figure?.portrait || cell.color
          }${cell.color}\n${cell.color}${cell.color}${cell.color}`;
        }),
      ]);
    }

    return table.toString();
  }

  private drawStatistics(): string[] {
    return [`Figures on board: ${this.board.figuresOnBoard.size}`];
  }
}
