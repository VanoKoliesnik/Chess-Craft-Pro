import CliTable from "cli-table3";

import { Holocron } from "@entities";
import { Rules } from "@rules";

import { DebugEngine } from "./debug";
import { RenderEngine } from "./render";

export class PainterEngine {
  private readonly rules: Rules;
  private readonly debugEngine: DebugEngine;
  private readonly holocron: Holocron;

  constructor(rules: Rules) {
    this.holocron = Holocron.getInstance();
    this.rules = rules;
    this.debugEngine = new DebugEngine(this.rules);

    new RenderEngine(this.rules.nextMove, this.draw.bind(this));
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

    for (const row of this.holocron.board) {
      table.push([
        rowsNames[row[0].coordinates.y],
        ...row.map((cell) => {
          const figure = Holocron.getInstance().getFigureByCell({
            coordinates: cell.coordinates,
          });

          return `${cell.color}${cell.color}${cell.color}\n${cell.color}${
            figure?.portrait || cell.color
          }${cell.color}\n${cell.color}${cell.color}${cell.color}`;
        }),
      ]);
    }

    return table.toString();
  }

  private drawStatistics(): string {
    return [
      `Figures on board: ${this.holocron.occupiedCellsCount}`,
      `Total figures count: ${this.holocron.figuresCount}`,
      `Players: ${this.holocron.playersCount}`,
    ].join("\n");
  }
}
