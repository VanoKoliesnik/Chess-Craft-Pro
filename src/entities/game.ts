import { DEFAULT_BOARD_SIZE } from "@common/constants";
import { Constructable, ISizeCoordinate } from "@common/types";

import { PainterEngine } from "@engine";
import { Holocron, Player } from "@entities";
import { Rules } from "@rules";

interface IGameConfig {
  Rules: Constructable<Rules, ISizeCoordinate>;
}

export class Game {
  private playersIterable: ArrayIterator<Player> = [][Symbol.iterator]();

  private readonly rules: Rules;

  constructor({ Rules }: IGameConfig) {
    this.rules = new Rules({ x: DEFAULT_BOARD_SIZE, y: DEFAULT_BOARD_SIZE });

    Holocron.getInstance({
      boardSize: { x: DEFAULT_BOARD_SIZE, y: DEFAULT_BOARD_SIZE },
      rules: this.rules,
    });

    this.rules.prepare();

    new PainterEngine(this.rules);
  }

  get nextPlayer(): Player {
    if (this.playersIterable.next().done) {
      this.playersIterable.return();
    }

    return this.playersIterable.next().value;
  }
}
