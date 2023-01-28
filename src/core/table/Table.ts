import Konva from "konva";
import {
  COLUMN_HEIGHT,
  DEFAULT_PADDING,
  FONT_FAMILY,
  MD_2_FONT_SIZE,
  TABLE_COLOR_HEIGHT,
  TABLE_NAME_BG,
  TABLE_WIDTH,
} from "./constants";
import { TableColumn } from "./TableRow";
import type { ColumnData, TableData } from "./types";

export class Table {
  #node!: Konva.Group;
  #colsPositions?: Record<string, number>;

  constructor(x: number, y: number, data: TableData) {
    this.init(x, y, data);
  }

  init(x: number, y: number, data: TableData): void {
    const table = new Konva.Group({
      x,
      y,
      draggable: true,
      width: TABLE_WIDTH,
    });

    const content = new Konva.Group({});

    const colorRect = new Konva.Rect({
      x,
      fill: data.color,
      width: TABLE_WIDTH,
      height: TABLE_COLOR_HEIGHT,
    });

    const namePanel = createTableNamePanel(data.name, x);
    const columns = createColumns(data.columns, x, y);

    content.add(namePanel);
    content.add(colorRect);
    content.add(columns);

    const wrapperBg = new Konva.Rect({
      x,
      fill: "white",
      shadowBlur: 5,
      shadowOpacity: 0.2,
      shadowColor: "black",
      height:
        TABLE_COLOR_HEIGHT * 2 +
        COLUMN_HEIGHT +
        data.columns.length * COLUMN_HEIGHT,
      width: TABLE_WIDTH,
    });

    table.add(wrapperBg);
    table.add(content);

    this.#node = table;
    this.#colsPositions = data.columns.reduce<Record<string, number>>(
      (acc, current, index) => {
        acc[current.id] = index;
        return acc;
      },
      {}
    );
  }

  indexOfCol(colId: string): number {
    return this.#colsPositions![colId];
  }

  getNode(): Konva.Group {
    return this.#node;
  }
}

const createTableNamePanel = (name: string, x: number): Konva.Group => {
  const group = new Konva.Group({
    x,
    y: TABLE_COLOR_HEIGHT,
    width: TABLE_WIDTH,
  });

  const bg = new Konva.Rect({
    fill: TABLE_NAME_BG,
    height: COLUMN_HEIGHT,
    width: TABLE_WIDTH,
  });

  const tableName = new Konva.Text({
    align: "center",
    fill: "black",
    text: name,
    strokeWidth: DEFAULT_PADDING,
    padding: DEFAULT_PADDING,
    fontSize: MD_2_FONT_SIZE,
    fontFamily: FONT_FAMILY,
    width: TABLE_WIDTH,
  });

  group.add(bg);
  group.add(tableName);

  return group;
};

const createColumns = (
  columns: ColumnData[],
  x: number,
  y: number
): Konva.Group => {
  const wrapper = new Konva.Group({
    x,
    y,
  });

  columns.forEach((column, index) => {
    const col = new TableColumn(index, column);
    wrapper.add(col.getNode());
  });

  return wrapper;
};
