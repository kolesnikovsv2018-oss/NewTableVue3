import { INewTableColumn } from "../components/NewTableHeader/types/INewTableHeadTypes";
import type { INewTableRow } from "../components/NewTableRow/types/NewTableRowTypes";

export interface INewTableRowActionEvent {
  name: string; // action name
  row: INewTableRow; // row
  value?: unknown; // INewTableCellActionData // event data from action component
}

export interface INewTableCellActionData {
  key: string; // cell name
  name?: string; // action name
  value?: unknown; // event data from cell component
}

export interface INewTableChangeColumnsOrderEvent {
  columnFrom: string | undefined;
  columnTo: string | null
}

export interface INewTableChangeColumnWidthEvent {
  columnName: string;
  delta: number;
  currentWidth: number;
}

export interface INewTableChangeFilterValue {
  key: string;
  value: string;
}

export interface INewTableCellNativeEvent {
  row?: INewTableRow;
  header?: INewTableColumn;
  event?: MouseEvent;
  modes?: string[];
}

export interface INewTableChangeCellValueEvent {
  key: string;
  value: unknown;
  row: INewTableRow;
}