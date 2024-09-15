import { Board } from "../board/board";
import { ICoordinates } from "../common/types";
import { RenderEngine } from "../engine/render.engine";
import { Queen } from "../figures";

export class Game {
  private readonly figuresPortraits = new Set(["🤩", "🤠"]).values();
  private readonly board: Board;
  private readonly renderEngine: RenderEngine;

  constructor() {
    this.board = new Board();

    this.setupFigures();

    this.renderEngine = new RenderEngine(this.render.bind(this));
    this.renderEngine.start();
  }

  moveFigure(
    figureCoordinates: ICoordinates,
    destinationCoordinates: ICoordinates
  ): boolean {
    return this.board.moveFigure(figureCoordinates, destinationCoordinates);
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

      cell.setFigure = new Queen(figurePortrait);
    }
  }

  private render(): string {
    return `${this.board.render()}

    Figures on board: ${this.board.figuresOnBoard.size}`;
  }
}
