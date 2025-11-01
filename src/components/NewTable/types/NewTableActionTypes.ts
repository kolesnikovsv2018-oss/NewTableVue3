import type { TNewTableRowMode } from "../components/NewTableRow/types/NewTableRowTypes";

export interface INewTableRowAction {
  actionName: string; // имя действия-action
  icon?: string, // иконка для действия fortawesome
  label?: string; // если указать, то будет отображатьс рядом с иконкой в стандартном исполнении
  modes?: TNewTableRowMode[]; // если не укзкть режим, для которого доступен action, то будет присутсвовать для всех типов строк
}

export type INewTableRowActions = Record<string, INewTableRowAction>

export type INewTableActions = Record<string, INewTableRowActions>
