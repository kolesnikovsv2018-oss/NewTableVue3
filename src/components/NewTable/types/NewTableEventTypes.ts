import type { INewTableColumn } from "../components/NewTableHeader/types/INewTableHeadTypes";
import type { INewTableRow } from "../components/NewTableRow/types/NewTableRowTypes";

export interface INewTableRowActionEvent {
  name: string; // action name
  row: INewTableRow; // row
  header?: INewTableColumn;

  value?: unknown; // INewTableCellActionData // event data from action component

  event?: Event | MouseEvent | KeyboardEvent;
  modes?: string[];
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

export interface INewTableChangeFilterValueEvent {
  key: string;
  value: string;
}

export interface INewTableChangeCellValueEvent {
  key: string;
  value: unknown;
  row: INewTableRow;
}