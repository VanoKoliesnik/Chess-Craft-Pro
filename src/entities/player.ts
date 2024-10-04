import { UUID, randomUUID } from "node:crypto";

import { FigureColor } from "@common/enums";
import { AppEventEmitter, EventName } from "@common/shared";
import { isIn } from "@common/utils";

type PlayerConfig = {
  figuresColor: FigureColor;
  name?: string;
};

export class Player {
  readonly id: UUID;
  readonly name: string;

  readonly figuresColor: FigureColor;

  constructor({ figuresColor, ...args }: PlayerConfig) {
    this.id = randomUUID();

    this.name = isIn(args, "name") ? args.name : randomUUID().split("-")[0];
    this.figuresColor = figuresColor;

    AppEventEmitter.getInstance().emit(EventName.SpawnPlayer, this);
  }
}
