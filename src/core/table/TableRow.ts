import Konva from "konva";

import {
  COLUMN_HEIGHT,
  FONT_FAMILY,
  MD_FONT_SIZE,
  TABLE_WIDTH,
} from "./constants";

import type { ColumnData } from "./types";

export class TableColumn {
  #node!: Konva.Group;

  constructor(index: number, data: ColumnData) {
    this.init(index, data);
  }

  init(index: number, data: ColumnData): void {
    const startY = index * COLUMN_HEIGHT;

    const group = new Konva.Group({
      y: startY,
    });

    const colName = new Konva.Text({
      padding: 8,
      fill: "#636363",
      text: data.name,
      width: TABLE_WIDTH,
      height: COLUMN_HEIGHT,
      fontSize: MD_FONT_SIZE,
      fontFamily: FONT_FAMILY,
      fontStyle: data.pk ? "bold" : "normal",
    });

    const typeName = new Konva.Text({
      align: "right",
      fill: "#9C9C9C",
      padding: 8,
      text: data.type,
      height: COLUMN_HEIGHT,
      width: TABLE_WIDTH,
      fontSize: MD_FONT_SIZE,
      fontFamily: FONT_FAMILY,
      fontStyle: data.pk ? "bold" : "normal",
    });

    const bg = new Konva.Rect({
      height: COLUMN_HEIGHT,
      width: TABLE_WIDTH,
    });

    typeName.on("mouseover", function () {
      bg.fill("aliceblue");
    });

    typeName.on("mouseout", function () {
      bg.fill("transparent");
    });

    group.add(bg, colName, typeName);
    this.#node = group;
  }

  getNode(): Konva.Group {
    return this.#node;
  }
}
