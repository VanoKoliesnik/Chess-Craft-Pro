import { DEFAULT_BOARD_SIZE } from "@common/constants";
import { CellType, Event } from "@common/enums";
import { AppEventEmitter, Coordinates, EventEmitter } from "@common/shared";
import {
  ICoordinate,
  ISizeCoordinate,
  MoveFigureResult,
  X,
  Y,
} from "@common/types";
import { CellsMap, FiguresMap } from "@common/types/maps";
import { genKey, randomNumber } from "@common/utils";

import { Cell, Figure } from "@entities";
import { Rules } from "@rules";

interface IBoardConfig {
  boardSize?: Partial<ISizeCoordinate>;
  rules: Rules;
}

export class Board {
  readonly columnsCount: number;
  readonly rowsCount: number;
  readonly figuresOnBoard: FiguresMap = new Map();
  readonly occupiedCells: CellsMap = new Map();

  private readonly cells: Cell[][] = [];

  private static instance: Board;

  private readonly rules: Rules;
  private readonly eventEmitter: EventEmitter;

  private constructor({ boardSize, rules }: IBoardConfig) {
    this.eventEmitter = AppEventEmitter.getInstance();
    this.rules = rules;

    this.columnsCount = boardSize?.x || DEFAULT_BOARD_SIZE;
    this.rowsCount = boardSize?.y || DEFAULT_BOARD_SIZE;

    for (let y = 0; y < this.columnsCount; y++) {
      this.cells[y] = [];

      for (let x = 0; x < this.rowsCount; x++) {
        this.cells[y][x] = new Cell({ x, y }, CellType.White);
      }
    }

    this.eventEmitter.on(
      Event.AddFigureToBoard,
      this.handleAddFigureToBoard.bind(this)
    );
  }

  static getInstance(config?: IBoardConfig): Board {
    if (!Board.instance) {
      Board.instance = new Board(config);
    }

    return Board.instance;
  }

  get getBoard(): Cell[][] {
    return this.cells;
  }

  get minX(): X {
    return 0;
  }

  get minY(): Y {
    return 0;
  }

  get maxX(): X {
    return this.columnsCount - 1;
  }

  get maxY(): Y {
    return this.rowsCount - 1;
  }

  get size(): ICoordinate {
    return { x: this.maxX, y: this.maxY };
  }

  getRow(y: ICoordinate["y"], excludedPoints: ICoordinate[] = []): Cell[] {
    const coordinatesRange = Coordinates.makeMatrix(
      { x: 0, y },
      { x: this.maxX, y },
      excludedPoints
    );
    return this.getCells(coordinatesRange);
  }

  getColumn(x: ICoordinate["x"]): Cell[] {
    // todo: use Coordinates.makeRange
    return this.getCellsByRange({ x, y: 0 }, { x, y: this.maxY });
  }

  getCell({ x, y }: ICoordinate): Cell {
    return this.getBoard?.[y]?.[x];
  }

  getCells(coordinates: ICoordinate[]): Cell[] {
    if (!coordinates.length) {
      return [];
    }

    const cells: Cell[] = [];

    for (const { x, y } of coordinates) {
      const cell = this.getBoard?.[y]?.[x];

      if (cell) {
        cells.push(cell);
      }
    }

    return cells;
  }

  // todo: remove after migration to Coordinates.makeRange
  getCellsByRange(
    startPoint: ICoordinate,
    endPoint: ICoordinate,
    excludedPoints: ICoordinate[] = []
  ): Cell[] {
    const points: ICoordinate[] = [];

    const xStart = Math.min(startPoint.x, endPoint.x);
    const xEnd = Math.max(startPoint.x, endPoint.x);

    const yStart = Math.min(startPoint.y, endPoint.y);
    const yEnd = Math.max(startPoint.y, endPoint.y);

    const pointsToExclude = Coordinates.makeSetList(excludedPoints);

    for (let x = xStart; x <= xEnd; x++) {
      for (let y = yStart; y <= yEnd; y++) {
        if (!pointsToExclude.has(Coordinates.getKey({ x, y }))) {
          points.push({ x, y });
        }
      }
    }

    return this.getCells(points);
  }

  getRandomCells(cellsCount = 1, shouldBeEmpty = true): Cell[] {
    if (cellsCount <= 0) {
      return [];
    }

    const cells = new Map<string, Cell>();

    let cellsLeftToPickCount = cellsCount;

    while (cellsLeftToPickCount > 0) {
      const y = randomNumber(this.columnsCount - 1);
      const x = randomNumber(this.rowsCount - 1);

      const key = genKey(x, y);

      if (!cells.has(key)) {
        const cell = this.getCell({ x, y });

        if (!shouldBeEmpty || (shouldBeEmpty && cell.isEmpty)) {
          cells.set(key, cell);

          cellsLeftToPickCount--;
        }
      }
    }

    return Array.from(cells.values());
  }

  moveFigure(
    figureCoordinates: ICoordinate,
    destinationCoordinates: ICoordinate
  ): MoveFigureResult {
    const originCell = this.getCell(figureCoordinates);

    if (originCell.isEmpty) {
      return { success: false, cells: [originCell, null], figure: null };
    }

    const destinationCell = this.getCell(destinationCoordinates);

    if (!destinationCell.canAcceptFigure) {
      return {
        success: false,
        cells: [originCell, destinationCell],
        figure: null,
      };
    }

    const figure = originCell.figure;

    if (!this.rules.isMoveAvailable(originCell, destinationCoordinates)) {
      return { success: false, cells: [originCell, destinationCell], figure };
    }

    originCell.setFigure = null;
    destinationCell.setFigure = figure;

    return { success: true, cells: [originCell, destinationCell], figure };
  }

  private handleAddFigureToBoard(figure: Figure, cell: Cell) {
    cell.setType = CellType.Black;

    this.occupiedCells.set(cell.coordinatesKey, cell);

    if (figure) {
      this.figuresOnBoard.set(figure.id, figure);
    }
  }

  iterateThroughBoard(
    callback: (cell: Cell) => void,
    onCellBreakCallback?: (cell: Cell) => boolean,
    onRowBreakCallback?: (cells: Cell[]) => boolean
  ): void {
    for (const rows of this.cells) {
      for (const cell of rows) {
        callback(cell);

        if (onCellBreakCallback && onCellBreakCallback(cell)) {
          break;
        }
      }

      if (onRowBreakCallback && onRowBreakCallback(rows)) {
        break;
      }
    }
  }
}
