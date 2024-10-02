import { UUID, randomUUID } from "node:crypto";

import { FigureColor } from "@common/enums";
import { AppEventEmitter, EventName } from "@common/shared";

type PlayerConfig = {
  figuresColor: FigureColor;
};

export class Player {
  readonly id: UUID;

  readonly figuresColor: FigureColor;

  constructor({ figuresColor }: PlayerConfig) {
    this.id = randomUUID();

    this.figuresColor = figuresColor;

    AppEventEmitter.getInstance().emit(EventName.SpawnPlayer, this);
  }
}
