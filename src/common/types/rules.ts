import { Player } from "@entities";

export type WinConditionsResult =
  | {
      hasSomeoneWon: true;
      player: Player;
    }
  | {
      hasSomeoneWon: false;
    };
