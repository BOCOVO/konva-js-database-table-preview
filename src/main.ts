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
      pk: false,
    },
    {
      name: "space_id",
      type: "integer",
      id: "4",
      pk: false,
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
      pk: true,
    },
    {
      name: "space_id",
      type: "integer",
      id: "2",
      pk: false,
    },
  ],
  name: "table2",
});

const table3 = new Table(group.x(), group.y(), {
  color: "green",
  columns: [
    {
      name: "space_id",
      type: "int",
      id: "1",
      pk: true,
    },
    {
      name: "space_id",
      type: "integer",
      id: "2",
      pk: false,
    },
  ],
  name: "table3",
});

const line = new TableConnection();
const line2 = new TableConnection();

const lineNodes = line.connectTable({
  end: {
    id: "1",
    table: table2,
    relation: "*",
  },
  start: {
    id: "4",
    table,
    relation: "1",
  },
});

const line2Nodes = line2.connectTable({
  end: {
    id: "1",
    table: table3,
    relation: "*",
  },
  start: {
    id: "4",
    table,
    relation: "1",
  },
});

group.add(...lineNodes);
group.add(...line2Nodes);
group.add(table.getNode());
group.add(table2.getNode());
group.add(table3.getNode());

stage.add(layer);
