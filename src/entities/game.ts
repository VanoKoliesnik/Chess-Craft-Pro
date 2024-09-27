import { Board, Figure, Queen } from "@entities";
import { CellType, FigureColor } from "@common/enums";
import {
  Constructable,
  ICoordinate,
  ISizeCoordinate,
  MoveFigureResult,
} from "@common/types";
import { RenderEngine } from "@engine";
import { Player } from "./player";
import { UUID } from "node:crypto";
import { PlayersMap } from "@common/types/maps";
import { DEFAULT_BOARD_SIZE } from "@common/constants";
import { Rules } from "@rules";

interface IGameConfig {
  players: [Player, Player];
  Rules: Constructable<Rules, ISizeCoordinate>;
}

export class Game {
  readonly board: Board;

  private readonly players: PlayersMap = new Map();

  private readonly figuresPortraits = new Set(["🤩", "🤠"]).values();
  private readonly renderEngine: RenderEngine;
  private readonly rules: Rules;

  constructor({ players, Rules }: IGameConfig) {
    players.forEach((player) => {
      this.players.set(player.id, player);
    });

    this.rules = new Rules({ x: DEFAULT_BOARD_SIZE, y: DEFAULT_BOARD_SIZE });
    this.board = Board.getInstance({ rules: this.rules });

    this.setupFigures();

    this.renderEngine = new RenderEngine(this.render.bind(this));
    this.renderEngine.start();
  }

  getAvailableMoves(coordinate: ICoordinate): ICoordinate[] {
    return this.rules.getAvailableMoves(this.board.getCell(coordinate));
  }

  getPlayer(id: UUID): Player {
    return this.players.get(id);
  }

  getFigure(coordinates: ICoordinate): Figure {
    return this.board.getCell(coordinates).figure;
  }

  moveFigure(
    figureCoordinates: ICoordinate,
    destinationCoordinates: ICoordinate
  ): MoveFigureResult {
    const moveFigureResult = this.board.moveFigure(
      figureCoordinates,
      destinationCoordinates
    );

    const {
      success,
      cells: [originCell, destinationCell],
    } = moveFigureResult;

    if (!success) {
      return moveFigureResult;
    }

    originCell.setType = CellType.Black;
    destinationCell.setType = CellType.Black;

    return moveFigureResult;
  }

  private setupFigures() {
    const cells = [this.board.getCell({ x: 4, y: 5 })];
    // const cells = this.board.getRandomCells(1, true);

    for (const cell of cells) {
      const figurePortrait = this.figuresPortraits.next().value;

      if (!figurePortrait) {
        console.error("There are more cells than portrait figures");
        return;
      }

      cell.setFigure = new Queen(figurePortrait, FigureColor.Black);
    }
  }

  private render(): string {
    return `${this.board.render()}

    Figures on board: ${this.board.figuresOnBoard.size}`;
  }
}
