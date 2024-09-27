import { randomUUID, UUID } from "node:crypto";

import { FigureColor, FigureMoveDirection, FigureType } from "@common/enums";

export abstract class Figure {
  readonly id: UUID;

  readonly portrait: string;
  readonly color: FigureColor;

  abstract readonly type: FigureType;
  abstract readonly maxDistance: number;
  abstract readonly moves: FigureMoveDirection[];

  constructor(portrait: string, color: FigureColor) {
    this.id = randomUUID();

    this.portrait = portrait;
    this.color = color;
  }
}
