import CliTable from "cli-table3";

import { Holocron } from "@entities";
import { Rules } from "@rules";

import { DebugEngine } from "./debug";

type PainterConfig = {
  rules: Rules;
};

export class PainterEngine {
  private readonly rules: Rules;
  private readonly debugEngine: DebugEngine;
  private readonly holocron: Holocron;

  constructor({ rules }: PainterConfig) {
    this.holocron = Holocron.getInstance();
    this.rules = rules;
    this.debugEngine = new DebugEngine({ rules });
  }

  draw(): string {
    return `
${this.drawBoard()}

${this.rules.drawStatistics()}`;
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
}
