export enum EventName {
  /**
   * @argument player: Player
   */
  SpawnPlayer = "SpawnPlayer",

  /**
   * @argument cell: Cell
   */
  SpawnCell = "SpawnCell",

  /**
   * @argument figure: Figure
   * @argument player: Player
   * @argument cell?: Cell
   */
  SpawnFigure = "SpawnFigure",

  /**
   * @argument figure: Figure
   * @argument cell: Cell
   */
  SetFigureOnCell = "SetFigureOnCell",

  /**
   * @argument winner: Player
   */
  GameFinished = "GameFinished",
}
