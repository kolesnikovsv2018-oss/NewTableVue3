import type { INewTableRowActionEvent } from "../NewTable/types/NewTableEventTypes";

export interface INewMenuItem {
  label: string;
  icon?: string;
  actionName?: string;
  payload?: INewTableRowActionEvent;
  children?: INewMenuItem[];
  modes?: string[];
};

export interface INewContextMenuXY {
  x: number;
  y: number;
}
