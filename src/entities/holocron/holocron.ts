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
  DestinationCell,
  EntitySearchArgsByCoordinates,
  EntitySearchArgsByMultipleCoordinates,
  ICoordinate,
  IResultSuccess,
  ISizeCoordinate,
  OriginCell,
} from "@common/types";
import { genKey, isIn } from "@common/utils";

import { Cell, Figure, Player } from "@entities";
import { Rules } from "@rules";

type HolocronConfig = {
  boardSize: ISizeCoordinate;
  rules: Rules;
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

  private readonly _cellToFigure = new Storage<Figure, CoordinatesKey>();
  private readonly _figureToCell = new Storage<ICoordinate, Figure["id"]>();
  private readonly _playerToFigure = new Storage<Figure, PlayerToFigureKey>();

  private _activePlayer: Player["id"];
  private _playerIterator: Generator<Player, Player>;

  private readonly eventEmitter: EventEmitter;
  private readonly rules: Rules;

  private constructor({ boardSize, rules }: HolocronConfig) {
    this.eventEmitter = AppEventEmitter.getInstance();
    this.rules = rules;

    this._boardSize = boardSize;

    this.listenForEvents();

    this.initializeBoard();
    this.updatePlayerIterator();
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

  get occupiedCells(): Cell[] {
    return this._cellToFigure
      .keys()
      .map((coordinateKey) => this._cells.get(coordinateKey));
  }

  get occupiedCellsCount(): number {
    return this._cellToFigure.keys().length;
  }

  get figuresCount(): number {
    return this._figures.size;
  }

  get players(): Player[] {
    return Array.from(this._players.values());
  }

  get playersCount(): number {
    return this._players.size;
  }

  get activePlayer() {
    return this._activePlayer;
  }

  getPlayerById(playerId: Player["id"]): Player {
    return this._players.get(playerId);
  }

  nextPlayer(): Player {
    if (!this._playerIterator) {
      this.updatePlayerIterator();
    }

    const nextPlayer = this._playerIterator.next().value;

    this._activePlayer = nextPlayer.id;

    return nextPlayer;
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

  getFiguresByPlayer(playerId: Player["id"]): Figure[] {
    return this._playerToFigure.searchValues(new RegExp(playerId));
  }

  getFiguresOnBoardByPlayer(
    playerId: Player["id"]
  ): Map<Figure["id"], ICoordinate> {
    const figures = this.getFiguresByPlayer(playerId);
    const cellsWithFigures = new Map<Figure["id"], ICoordinate>();

    for (const cell of this.occupiedCells) {
      for (const figure of figures) {
        const figureOnCell = this.getFigureByCell({
          coordinates: cell.coordinates,
        });

        if (figureOnCell && figureOnCell.id === figure.id) {
          cellsWithFigures.set(figure.id, cell.coordinates);
        }
      }
    }

    return cellsWithFigures;
  }

  moveFigure(
    originCoordinates: ICoordinate,
    destinationCoordinates: ICoordinate
  ): {
    cells: [OriginCell, DestinationCell];
  } & IResultSuccess {
    const originCell = this.getCell({ coordinates: originCoordinates });

    if (originCell.isEmpty) {
      return { success: false, cells: [originCell, null] };
    }

    const destinationCell = this.getCell({
      coordinates: destinationCoordinates,
    });

    if (!this.rules.checkIfCanAcceptFigure(destinationCell)) {
      return {
        success: false,
        cells: [originCell, destinationCell],
      };
    }

    if (!this.rules.isMoveAvailable(originCell, destinationCoordinates)) {
      return { success: false, cells: [originCell, destinationCell] };
    }

    const figure = this._cellToFigure.get(
      Coordinates.getKey(originCoordinates)
    );

    this.setFigureOnCell(null, originCoordinates);
    this.setFigureOnCell(figure, destinationCoordinates);

    return { success: true, cells: [originCell, destinationCell] };
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
    this.updatePlayerIterator();
  }

  private addFigure(
    figure: Figure,
    playerId: Player["id"],
    cellCoordinate?: ICoordinate
  ): void {
    this._figures.set(figure.id, figure);

    this._playerToFigure.set(
      this.getPlayerToFigureKey(playerId, figure.id),
      figure
    );

    if (cellCoordinate) {
      this._cellToFigure.set(Coordinates.getKey(cellCoordinate), figure);
      this._figureToCell.set(figure.id, cellCoordinate);
    }
  }

  private setFigureOnCell(figure: Figure, cellCoordinates: ICoordinate): void {
    if (figure === null) {
      this._cellToFigure.remove(Coordinates.getKey(cellCoordinates));
      return;
    }

    this._cellToFigure.set(Coordinates.getKey(cellCoordinates), figure);
    this._figureToCell.set(figure.id, cellCoordinates);
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

  private updatePlayerIterator() {
    this._playerIterator = this.createPlayersIterator();
  }

  private *createPlayersIterator(): Generator<Player> {
    while (true) {
      for (const player of this._players.values()) {
        yield player;
      }
    }
  }

  private getPlayerToFigureKey(
    playerId: Player["id"],
    figureId: Figure["id"]
  ): PlayerToFigureKey {
    return genKey<PlayerToFigureKey>(playerId, figureId);
  }
}
