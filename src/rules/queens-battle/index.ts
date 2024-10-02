import { CellType, FigureColor, FigureType } from "@common/enums";
import { NotFoundError } from "@common/errors";
import { ICoordinate } from "@common/types";
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

  constructor() {
    super();

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

  nextMove(): void {
    const player = Holocron.getInstance().nextPlayer();
    const figureCoordinates = Holocron.getInstance()
      .getFiguresOnBoardByPlayer(player.id)
      .values()
      .next().value;

    const availableMoves = this.getAvailableMoves(figureCoordinates);

    if (!availableMoves.length) {
      process.exit();
    }

    const nextMoveCoordinates = pickRandomElement(availableMoves);

    if (!nextMoveCoordinates) {
      process.exit();
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
    } else {
      process.exit();
    }
  }

  spawnPlayers(): void {
    new Player({ figuresColor: FigureColor.Black });
    new Player({ figuresColor: FigureColor.White });
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
}
