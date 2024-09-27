import { UUID, randomUUID } from "node:crypto";

import { FiguresMap } from "@common/types/maps";

import { Figure } from "@entities";

export class Player {
  readonly id: UUID;

  readonly figures: FiguresMap = new Map();

  constructor() {
    this.id = randomUUID();
  }

  addFigure(figure: Figure) {
    this.figures.set(figure.id, figure);
  }

  addFigures(figures: Figure[]) {
    for (const figure of figures) {
      this.figures.set(figure.id, figure);
    }
  }
}
