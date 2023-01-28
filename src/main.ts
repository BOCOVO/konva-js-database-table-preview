import Konva from "konva";
import { Table } from "./core/table/Table";
import { TableConnection } from "./core/table/TableConnection";

const width = 1000;
const height = 1000;

const stage = new Konva.Stage({
  container: "app",
  width,
  height,
});

const layer = new Konva.Layer();

const group = new Konva.Group({
  x: 40,
  y: 40,
  draggable: true,
});

layer.add(group);

const table = new Table(group.x(), group.y(), {
  color: "red",
  columns: [
    {
      name: "space_id",
      type: "int",
      id: "3",
    },
    {
      name: "space_id",
      type: "integer",
      id: "4",
    },
  ],
  name: "table",
});

const table2 = new Table(group.x(), group.y(), {
  color: "red",
  columns: [
    {
      name: "space_id",
      type: "int",
      id: "1",
    },
    {
      name: "space_id",
      type: "integer",
      id: "2",
    },
  ],
  name: "table2",
});

const line = new TableConnection();

line.connectTable({
  end: {
    id: "1",
    table: table2,
  },
  start: {
    id: "4",
    table,
  },
});

group.add(line.getNode());
group.add(table.getNode());
group.add(table2.getNode());

stage.add(layer);
