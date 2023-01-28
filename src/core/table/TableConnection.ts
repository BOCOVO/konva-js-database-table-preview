import Konva from "konva";
import {
  COLUMN_HEIGHT,
  CONNECTION_ACTIVE_COLOR,
  CONNECTION_COLOR,
  CONNECTION_MARGIN,
  CONNECTION_STROKE,
  CROSS_CONNECTION_MIN_MARGIN,
  DEFAULT_PADDING,
  MD_FONT_SIZE,
} from "./constants";
import type { Table } from "./Table";

interface ConnectTableData {
  table: Table;
  id: string;
  relation: "1" | "*";
}

interface ConnectTableParam {
  start: ConnectTableData;
  end: ConnectTableData;
}

/**
 * [,,to know if it is cross x]
 */
type Cords = [number, number, boolean];

export class TableConnection {
  #node!: Konva.Line;
  #startRelationTypeText?: Konva.Text;
  #endRelationTypeText?: Konva.Text;

  constructor() {
    this.init();
  }

  init(): void {
    const line = new Konva.Line({
      points: [],
      stroke: CONNECTION_COLOR,
      strokeWidth: CONNECTION_STROKE,
      lineJoin: "round",
    });

    this.#node = line;

    this.#node.on("mouseover", this.setHover);
    this.#node.on("mouseout", this.setBlur);
  }

  getNode(): Konva.Line {
    return this.#node;
  }

  #updatePoints({
    x1,
    x2,
    x3,
    x4,
    y1,
    y2,
  }: {
    x1: number;
    x2: number;
    x3: number;
    x4: number;
    y1: number;
    y2: number;
  }): void {
    const crossCords: Cords[] = [
      [x1, x4, true],
      [x2, x3, true],
    ];

    const endCords: Cords = [x2, x4, false];
    const allowCrossCords =
      (x2 < x3 || x1 > x4) && Math.abs(x2 - x3) > 50 && Math.abs(x1 - x4) > 50;

    const combinedCords = [...(allowCrossCords ? crossCords : []), endCords];

    const sortedCords = combinedCords.sort(
      ([a, b], [c, d]) => Math.abs(a - b) - Math.abs(c - d)
    );

    const [posX1, posX2, isCrossX] = sortedCords[0];

    this.updateLine([posX1, posX2, y1, y2, isCrossX]);
  }

  updateLine([x1, x2, y1, y2, isCrossX]: [
    number,
    number,
    number,
    number,
    boolean
  ]): void {
    const x1ToLeft = x1 - x2 > 0;

    this.#startRelationTypeText?.x(
      x1 + (!x1ToLeft || !isCrossX ? MD_FONT_SIZE / 2 : -MD_FONT_SIZE)
    );
    this.#startRelationTypeText?.y(y1 - MD_FONT_SIZE);

    this.#endRelationTypeText?.x(
      x2 + (x1ToLeft || !isCrossX ? MD_FONT_SIZE / 2 : -MD_FONT_SIZE)
    );
    this.#endRelationTypeText?.y(y2 - MD_FONT_SIZE);

    if (isCrossX) {
      const x1NextPoint = x1ToLeft
        ? x1 - CROSS_CONNECTION_MIN_MARGIN
        : x1 + CROSS_CONNECTION_MIN_MARGIN;
      const x2NextPoint = x1ToLeft
        ? x2 + CROSS_CONNECTION_MIN_MARGIN
        : x2 - CROSS_CONNECTION_MIN_MARGIN;

      this.#node.points([x1, y1, x1NextPoint, y1, x2NextPoint, y2, x2, y2]);

      return;
    }

    const x1NextPoint = x1ToLeft
      ? x1 + CROSS_CONNECTION_MIN_MARGIN
      : x2 + CROSS_CONNECTION_MIN_MARGIN;

    this.#node.points([x1, y1, x1NextPoint, y1, x1NextPoint, y2, x2, y2]);
  }

  connectTable({
    end,
    start,
  }: ConnectTableParam): Parameters<Konva.Group["add"]> {
    const startTable = start.table.getNode();
    const endTable = end.table.getNode();

    this.#endRelationTypeText = new Konva.Text({
      opacity: 0,
    });

    this.#startRelationTypeText = new Konva.Text({
      opacity: 0,
    });

    this.#endRelationTypeText.setText(end.relation);
    this.#startRelationTypeText.setText(start.relation);

    const updater = (): void => {
      const x1 = startTable.x() + CONNECTION_MARGIN;
      const x2 = x1 + startTable.width();

      const x3 = endTable.x() + CONNECTION_MARGIN;
      const x4 = x3 + endTable.width();

      const y1 =
        startTable.y() +
        this.computeTopMargin(start.table.indexOfCol(start.id));

      const y2 =
        endTable.y() + this.computeTopMargin(end.table.indexOfCol(end.id));

      this.#updatePoints({ x1, x2, x3, x4, y1, y2 });
    };

    updater();
    startTable.on("dragmove", updater);
    endTable.on("dragmove", updater);

    startTable.on("mouseover", this.setHover);

    startTable.on("mouseout", this.setBlur);

    endTable.on("mouseover", this.setHover);

    endTable.on("mouseout", this.setBlur);

    return [this.#endRelationTypeText, this.#startRelationTypeText];
  }

  computeTopMargin(index: number): number {
    return DEFAULT_PADDING * 2 + COLUMN_HEIGHT * (1.5 + index);
  }

  setHover: () => void = () => {
    this.#node.stroke(CONNECTION_ACTIVE_COLOR);
    this.#endRelationTypeText?.opacity(1);
    this.#startRelationTypeText?.opacity(1);
  };

  setBlur: () => void = () => {
    this.#node.stroke(CONNECTION_COLOR);
    this.#endRelationTypeText?.opacity(0);
    this.#startRelationTypeText?.opacity(0);
  };
}
