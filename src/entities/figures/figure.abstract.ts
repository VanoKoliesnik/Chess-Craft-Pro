import { randomUUID, UUID } from "node:crypto";

import { FigureColor, FigureType } from "@common/enums";
import { AppEventEmitter, EventName } from "@common/shared";
import { ICoordinate } from "@common/types";

import { Player } from "@entities";

export abstract class Figure {
  readonly id: UUID;

  readonly portrait: string;
  readonly color: FigureColor;

  abstract readonly type: FigureType;

  constructor(portrait: string, player: Player, cell?: ICoordinate) {
    this.id = randomUUID();

    this.portrait = portrait;
    this.color = player.figuresColor;

    AppEventEmitter.getInstance().emit(
      EventName.SpawnFigure,
      this,
      player.id,
      cell
    );
  }
}
