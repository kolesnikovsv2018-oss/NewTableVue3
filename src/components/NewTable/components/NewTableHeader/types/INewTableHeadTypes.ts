export interface INewTableColumnMeta {
  width?: number;
  class?: string;
  headerClass?: string;
}

export interface INewTableColumnComponent {
  name: string;
  props?: Record<string, unknown>;
  changeEventName?: string
}

export interface INewTableColumnComponents extends Record<string, INewTableColumnComponent | undefined> {
  default?: INewTableColumnComponent
}

export interface INewTableColumn {
  name: string;
  key: string;
  meta?: INewTableColumnMeta;
  components: INewTableColumnComponents;
}

export interface INewTableHeaderSetting {
  width: number;
  order: number;
  visible: boolean;
}

export type INewTableHeaderSettings = Record<string, INewTableHeaderSetting>;

export type INewTableFilterComponent = INewTableColumnComponent;