/**
 * Construct a square grid container
 */
declare class SquareGrid extends BaseGrid {
  /** @override */
  draw(): this;

  _drawLine(
    points: [x1: number, y1: number, x2: number, y2: number],
    lineColor: number,
    lineAlpha: number
  ): PIXI.Graphics;

  /** @override */
  getCenter(x: number, y: number): PointArray;

  /** @override */
  getGridPositionFromPixels(x: number, y: number): PointArray;

  /** @override */
  getPixelsFromGridPosition(row: number, col: number): PointArray;

  /**
   * @override
   * @param interval - (default: `1`)
   */
  getSnappedPosition(x: number, y: number, interval?: number | null): { x: number; y: number };

  /**
   * Shift a pixel position [x,y] by some number of grid units dx and dy
   * @param x  - The starting x-coordinate in pixels
   * @param y  - The starting y-coordinate in pixels
   * @param dx - The number of grid positions to shift horizontally
   * @param dy - The number of grid positions to shift vertically
   */
  shiftPosition(x: number, y: number, dx: number, dy: number): PointArray;

  protected _getNearestVertex(x: number, y: number): PointArray;

  /**
   * @override
   * @param options - (default: `{}`)
   */
  highlightGridPosition(layer: GridHighlight, options?: BaseGrid.HighlightGridPositionOptions): void;

  /**
   * @override
   * @param options - (default: `{}`)
   */
  measureDistances(segments: GridLayer.Segment[], options?: BaseGrid.MeasureDistancesOptions): number[];

  /** @override */
  getNeighbors(row: number, col: number): PointArray[];
}
