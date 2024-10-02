import { CellType } from "@common/enums";
import {
  AppEventEmitter,
  Coordinates,
  EventEmitter,
  EventName,
  Storage,
} from "@common/shared";
import {
  CoordinatesKey,
  EntitySearchArgsByCoordinates,
  EntitySearchArgsByMultipleCoordinates,
  ICoordinate,
  ISizeCoordinate,
} from "@common/types";
import { genKey, isIn } from "@common/utils";

import { Cell, Figure, Player } from "@entities";

type HolocronConfig = {
  boardSize: ISizeCoordinate;
};

type IterateThroughBoardArgs = {
  cellCallback?: (cell: Cell) => void;
  rowCallback?: (cells: Cell[]) => void;

  onCellBreakCallback?: (cell: Cell) => boolean;
  onRowBreakCallback?: (cells: Cell[]) => boolean;
};

type PlayerToFigureKey = `${Player["id"]}_${Figure["id"]}`;

export class Holocron {
  private static instance: Holocron;

  private readonly _boardSize: ISizeCoordinate;
  private readonly _cells = new Map<CoordinatesKey, Cell>();
  private readonly _players = new Map<Player["id"], Player>();
  private readonly _figures = new Map<Figure["id"], Figure>();

  private readonly _cellToFigure = new Storage<Figure>();
  private readonly _playerToFigure = new Storage<Figure>();

  private readonly eventEmitter: EventEmitter;

  private constructor({ boardSize }: HolocronConfig) {
    this.eventEmitter = AppEventEmitter.getInstance();

    this._boardSize = boardSize;

    this.listenForEvents();

    this.initializeBoard();
  }

  static getInstance(config?: HolocronConfig): Holocron {
    if (!Holocron.instance) {
      Holocron.instance = new Holocron(config);
    }

    return Holocron.instance;
  }

  get minX() {
    return 0;
  }

  get minY() {
    return 0;
  }

  get maxX() {
    return this.boardSize.x - 1;
  }

  get maxY() {
    return this.boardSize.y - 1;
  }

  get boardSize() {
    return this._boardSize;
  }

  get board(): Cell[][] {
    const board: Cell[][] = [];

    for (let y = this.minY; y <= this.maxX; y++) {
      const row: Cell[] = [];

      for (let x = this.minX; x <= this.maxY; x++) {
        row.push(this._cells.get(Coordinates.getKey({ x, y })));
      }

      board.push(row);
    }

    return board;
  }

  get players(): Player[] {
    return Array.from(this._players.values());
  }

  get occupiedCells(): Cell[] {
    return this._cellToFigure
      .keys()
      .map((coordinateKey) => this._cells.get(coordinateKey as CoordinatesKey));
  }

  get occupiedCellsCount(): number {
    return this._cellToFigure.keys().length;
  }

  get figuresCount(): number {
    return this._figures.size;
  }

  get playersCount(): number {
    return this._players.size;
  }

  *nextPlayer(): Generator<Player> {
    for (const [, player] of this._players) {
      yield player;
    }
  }

  getCell({ coordinates }: EntitySearchArgsByCoordinates) {
    return this._cells.get(Coordinates.getKey(coordinates));
  }

  getCells({ coordinates }: EntitySearchArgsByMultipleCoordinates) {
    if (!coordinates.length) {
      return [];
    }

    const cells: Cell[] = [];

    for (const coordinate of coordinates) {
      const cell = this.getCell({ coordinates: coordinate });

      if (cell) {
        cells.push(cell);
      }
    }

    return cells;
  }

  getFigureByCell({ coordinates }: EntitySearchArgsByCoordinates): Figure {
    return this._cellToFigure.get(Coordinates.getKey(coordinates)) || null;
  }

  iterateBoard(args: IterateThroughBoardArgs): void {
    for (const row of this.board) {
      for (const cell of row) {
        if (
          isIn(args, "onCellBreakCallback") &&
          args.onCellBreakCallback(cell)
        ) {
          break;
        }

        if (isIn(args, "cellCallback")) {
          args.cellCallback(cell);
        }
      }

      if (isIn(args, "onRowBreakCallback") && args.onRowBreakCallback(row)) {
        break;
      }

      if (isIn(args, "rowCallback")) {
        args.rowCallback(row);
      }
    }
  }

  private addCell(cell: Cell): void {
    this._cells.set(Coordinates.getKey(cell.coordinates), cell);
  }

  private addPlayer(player: Player): void {
    this._players.set(player.id, player);
  }

  private addFigure(
    figure: Figure,
    player: Player["id"],
    cell?: ICoordinate
  ): void {
    this._figures.set(figure.id, figure);

    this._playerToFigure.set(
      this.getPlayerToFigureKey(player, figure.id),
      figure
    );

    if (cell) {
      this._cellToFigure.set(Coordinates.getKey(cell), figure);
    }
  }

  private setFigureOnCell(figure: Figure, cell: ICoordinate): void {
    if (figure === null) {
      this._cellToFigure.remove(Coordinates.getKey(cell));
      return;
    }

    this._cellToFigure.set(Coordinates.getKey(cell), figure);
  }

  private listenForEvents() {
    this.eventEmitter.on(EventName.SpawnPlayer, this.addPlayer.bind(this));
    this.eventEmitter.on(EventName.SpawnCell, this.addCell.bind(this));
    this.eventEmitter.on(EventName.SpawnFigure, this.addFigure.bind(this));
    this.eventEmitter.on(
      EventName.SetFigureOnCell,
      this.setFigureOnCell.bind(this)
    );
  }

  private initializeBoard() {
    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxY; x++) {
        new Cell({ x, y }, CellType.White);
      }
    }
  }

  private getPlayerToFigureKey(
    player: Player["id"],
    figure: Figure["id"]
  ): PlayerToFigureKey {
    return genKey(player, figure) as PlayerToFigureKey;
  }
}
