export interface INewMenuItem {
  label: string;
  icon?: string;
  actionName?: string;
  payload?: unknown;
  children?: INewMenuItem[];
  modes?: string[];
};

export interface INewContextMenuXY {
  x: number;
  y: number;
}
