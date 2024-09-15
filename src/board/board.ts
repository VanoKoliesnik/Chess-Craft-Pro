import CliTable from "cli-table3";

import { Cell } from "../cell/cell";
import { CellType, Event, FigureMoveDirection } from "../common/enums";
import { AppEventEmitter, Coordinates, EventEmitter } from "../common/shared";
import { ICoordinates, X, Y } from "../common/types";
import { Figure } from "../figures";
import { genKey, randomNumber } from "../common/utils";

export class Board {
  readonly columnsCount: number;
  readonly rowsCount: number;
  readonly figuresOnBoard = new Map<Figure["id"], Figure>();

  private readonly board: Cell[][] = [];
  private readonly coordinates: Coordinates;
  private readonly occupiedCells: Cell[] = [];

  private readonly eventEmitter: EventEmitter;

  constructor(columnsCount = 8, rowsCount = 8) {
    this.eventEmitter = AppEventEmitter.getInstance();

    this.columnsCount = columnsCount;
    this.rowsCount = rowsCount;

    this.coordinates = new Coordinates(this.maxX, this.maxY);

    for (let y = 0; y < this.columnsCount; y++) {
      this.board[y] = [];

      for (let x = 0; x < this.rowsCount; x++) {
        this.board[y][x] = new Cell({ x, y }, CellType.White);
      }
    }

    this.eventEmitter.on(
      Event.AddFigureToBoard,
      this.handleAddFigureToBoard.bind(this)
    );
  }

  get getBoard(): Cell[][] {
    return this.board;
  }

  get maxX(): X {
    return this.columnsCount - 1;
  }

  get maxY(): Y {
    return this.rowsCount - 1;
  }

  get boardSize(): ICoordinates {
    return { x: this.maxX, y: this.maxY };
  }

  getCell({ x, y }: ICoordinates): Cell {
    return this.getBoard[y][x];
  }

  getCells(coordinates: ICoordinates[]): Cell[] {
    if (!coordinates.length) {
      return [];
    }

    const cells: Cell[] = [];

    for (const { x, y } of coordinates) {
      cells.push(this.getBoard[y][x]);
    }

    return cells;
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
    figureCoordinates: ICoordinates,
    destinationCoordinates: ICoordinates
  ): boolean {
    const originCell = this.getCell(figureCoordinates);

    if (originCell.isEmpty) {
      return false;
    }

    const destinationCell = this.getCell(destinationCoordinates);

    if (!destinationCell.isEmpty) {
      return false;
    }

    const figure = originCell.figure;

    if (
      !figure.isMoveAvailable(
        destinationCoordinates,
        figureCoordinates,
        this.boardSize
      )
    ) {
      return false;
    }

    originCell.setFigure = null;
    destinationCell.setFigure = figure;
    destinationCell.type = CellType.Black;

    return true;
  }

  render(): string {
    const table = new CliTable({
      head: [
        `   x\n-----\n y`,
        ...Array.from({ length: this.board[0].length }, (_, i) =>
          String(i + 1)
        ),
      ],
    });

    this.__debug__highlightAllFiguresAvailableMoves();

    for (const row of this.board) {
      table.push([
        String(row[0].coordinates.y + 1),
        ...row.map((cell) => {
          return `${cell.color}${cell.color}${cell.color}\n${cell.color}${
            cell.figure?.portrait || cell.color
          }${cell.color}\n${cell.color}${cell.color}${cell.color}`;
        }),
      ]);
    }

    return table.toString();
  }

  private handleAddFigureToBoard(figure: Figure, cell: Cell) {
    this.occupiedCells.push(cell);

    if (figure) {
      this.figuresOnBoard.set(figure.id, figure);
    }
  }

  private iterateThroughBoard(
    callback: (cell: Cell) => void,
    onCellBreakCallback?: (cell: Cell) => boolean,
    onRowBreakCallback?: (cells: Cell[]) => boolean
  ): void {
    for (const rows of this.board) {
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

  __debug__highlightAllFiguresAvailableMoves(): void {
    this.iterateThroughBoard((cell: Cell) => {
      if (cell.type !== CellType.Black) {
        cell.type = CellType.White;
      }
    });

    this.occupiedCells.map(({ coordinates }) => {
      this.__debug__highlightAvailableMoves(coordinates);
    });
  }

  __debug__highlightAvailableMoves(coordinates: ICoordinates): void {
    const cell = this.getCell(coordinates);

    if (!cell.figure) {
      return;
    }

    for (const moveType of cell.figure.moves) {
      const coordinates = cell.coordinates;
      switch (moveType) {
        case FigureMoveDirection.Horizontal:
          this.__debug__highlightAvailableHorizontalMoves(
            coordinates.x,
            coordinates.y
          );
          break;

        case FigureMoveDirection.Vertical:
          this.__debug__highlightAvailableVerticalMoves(
            coordinates.x,
            coordinates.y
          );
          break;

        case FigureMoveDirection.Diagonal:
          this.__debug__highlightAvailableDiagonalMoves(
            coordinates.x,
            coordinates.y
          );
          break;

        default:
          break;
      }
    }
  }

  __debug__highlightAvailableHorizontalMoves(x: X, y: Y): void {
    const horizontalCoordinatesToHighlight =
      this.coordinates.getHorizontalMoves({ x, y });

    const cellsToHighlight: Cell[] = this.getCells(
      horizontalCoordinatesToHighlight
    ).filter(Boolean);

    for (const cell of cellsToHighlight) {
      cell.type = CellType.Blue;
    }
  }

  __debug__highlightAvailableVerticalMoves(x: X, y: Y): void {
    const verticalCoordinatesToHighlight = this.coordinates.getVerticalMoves({
      x,
      y,
    });

    const cellsToHighlight: Cell[] = this.getCells(
      verticalCoordinatesToHighlight
    ).filter(Boolean);

    for (const cell of cellsToHighlight) {
      cell.type = CellType.Blue;
    }
  }

  __debug__highlightAvailableDiagonalMoves(x: X, y: Y): void {
    const diagonalCoordinatesToHighlight = this.coordinates.getDiagonalMoves({
      x,
      y,
    });

    const cellsToHighlight: Cell[] = this.getCells(
      diagonalCoordinatesToHighlight
    ).filter(Boolean);

    for (const cell of cellsToHighlight) {
      cell.type = CellType.Blue;
    }
  }
}
