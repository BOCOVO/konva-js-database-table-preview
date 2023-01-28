export interface TableData {
  name: string;
  columns: ColumnData[];
  color: string;
}

export interface ColumnData {
  name: string;
  type: string;
  id: string;
}
