import CliTable from "cli-table3";

import { CellType, FigureColor, FigureType } from "@common/enums";
import { FailureError, NotFoundError } from "@common/errors";
import { ICoordinate, WinConditionsResult } from "@common/types";
import { pickRandomElement } from "@common/utils";

import { Cell, Holocron, Player, Queen } from "@entities";

import { Rules } from "../rules.abstract";
import { QueensBattleRulesAvailableMoves } from "./available-moves";

export class QueensBattleRules extends Rules {
  readonly name = "Queens Battle";

  private cellsToSpawnFigures: SetIterator<ICoordinate>;

  private readonly maxCellsToJumpOver: number;
  private readonly availableMoves: QueensBattleRulesAvailableMoves;
  private readonly figuresPortraits = new Set(["🤴", "👸"]).values();

  private readonly score = new Map<Player["id"], number>();
  private figureMovesAvailable: boolean;

  constructor() {
    super();

    this.figureMovesAvailable = true;
    this.maxCellsToJumpOver = 1;
    this.availableMoves = new QueensBattleRulesAvailableMoves({
      maxCellsToJumpOver: this.maxCellsToJumpOver,
    });
  }

  prepare(): void {
    this.cellsToSpawnFigures = new Set([
      { x: 3, y: 0 },
      { x: 4, y: Holocron.getInstance().maxY },
    ]).values();

    this.spawnPlayers();
    this.spawnFigures();
  }

  spawnPlayers(): void {
    const players = [
      new Player({
        figuresColor: FigureColor.Black,
        name: "Darth Vader",
      }),
      new Player({
        figuresColor: FigureColor.White,
        name: "Luke Skywalker",
      }),
    ];

    for (const player of players) {
      this.score.set(player.id, 0);
    }
  }

  spawnFigures(): void {
    Holocron.getInstance().players.forEach((player) => {
      const cellCoordinates = this.cellsToSpawnFigures.next().value;

      if (!cellCoordinates) {
        throw new NotFoundError(`next cellCoordinates not found`);
      }

      new Queen(this.figuresPortraits.next().value, player, cellCoordinates);
    });
  }

  checkIfCanAcceptFigure(cell: Cell): boolean {
    return cell.isEmpty && cell.type !== CellType.Black;
  }

  getCellAvailableMoves(cell: Cell): ICoordinate[] {
    const figure = Holocron.getInstance().getFigureByCell({
      coordinates: cell.coordinates,
    });

    if (!figure || figure.type !== FigureType.Queen) {
      return [];
    }

    return []
      .concat(this.availableMoves.getAvailableHorizontalMoves(cell.coordinates))
      .concat(this.availableMoves.getAvailableVerticalMoves(cell.coordinates))
      .concat(this.availableMoves.getAvailableDiagonalMoves(cell.coordinates));
  }

  checkWinningConditions(): WinConditionsResult {
    if (!this.figureMovesAvailable) {
      return {
        hasSomeoneWon: true,
        player: this.getHighestScorePlayer(),
      };
    }

    return { hasSomeoneWon: false };
  }

  drawStatistics(): string {
    const holocron = Holocron.getInstance();

    if (this.winner) {
      return `Winner is ${this.winner.name}`;
    }

    const activePlayer = holocron.getPlayerById(holocron.activePlayer);

    const divider = `\n${"=".repeat(20)}\n`;

    const scoreTable = new CliTable({
      head: ["Player", "Score"],
    });

    for (const player of holocron.players) {
      scoreTable.push([player.name, this.score.get(player.id)]);
    }

    return [
      `Players: ${holocron.players.map(({ name, figuresColor }) => `${name} ${figuresColor}`).join(" | ")}`,
      divider,
      `Active player: ${activePlayer?.name} ${activePlayer?.figuresColor}`,
      divider,
      scoreTable.toString(),
    ].join("\n");
  }

  protected nextMove(): void {
    const player = Holocron.getInstance().nextPlayer();
    const figureCoordinates = Holocron.getInstance()
      .getFiguresOnBoardByPlayer(player.id)
      .values()
      .next().value;

    const availableMoves = this.getAvailableMoves(figureCoordinates);

    if (!availableMoves.length) {
      this.figureMovesAvailable = false;
      return;
    }

    const nextMoveCoordinates = pickRandomElement(availableMoves);

    if (!nextMoveCoordinates) {
      throw new NotFoundError("Cannot pick find next move coordinates");
    }

    const {
      success,
      cells: [, destinationCell],
    } = Holocron.getInstance().moveFigure(
      figureCoordinates,
      nextMoveCoordinates
    );

    if (success) {
      destinationCell.setType = CellType.Black;
      this.score.set(player.id, this.score.get(player.id) + 1);
    } else {
      throw new FailureError("Cannot move to the destination coordinates");
    }
  }

  private getHighestScorePlayer(): Player {
    let playerId: Player["id"] = null;
    let highestScore = -Infinity;

    for (const [id, score] of this.score) {
      if (score > highestScore) {
        highestScore = score;
        playerId = id;
      }
    }

    return Holocron.getInstance().getPlayerById(playerId);
  }
}
