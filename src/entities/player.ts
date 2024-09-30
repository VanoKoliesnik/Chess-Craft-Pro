import { UUID, randomUUID } from "node:crypto";

import { FigureColor } from "@common/enums";

type PlayerConfig = {
  figuresColor: FigureColor;
};

export class Player {
  readonly id: UUID;

  readonly figuresColor: FigureColor;

  constructor({ figuresColor }: PlayerConfig) {
    this.id = randomUUID();

    this.figuresColor = figuresColor;
  }
}
