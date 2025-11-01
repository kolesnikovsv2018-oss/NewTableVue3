
import { NEW_TABLE_STANDART_ROW_MODES } from '../../../constants/standartRowModes';

export type TNewTableRowMode = keyof typeof NEW_TABLE_STANDART_ROW_MODES //'edit' | 'view' | 'delete' | 'custom';

export interface IId {
  id: string | number
}

export interface ILocalNewTableRowDataCommon extends IId {
  [key: string]: unknown
}

export interface INewTableRowMeta {
  rowType?: string | number;
  class?: string;
}

export interface INewTableRowCommonMeta {
  rowType?: string | number;
  class?: Record<string, string>;
}

export interface INewTableRowTemplate<T extends Record<string, unknown>> {
  meta: INewTableRowMeta;
  data: T;
  children?: INewTableRowTemplate<T>[];
  // actions?: Record<string, INewTableRowAction>;
  __level?: number; // for internal use in flat data generation
}

export type INewTableRow = INewTableRowTemplate<ILocalNewTableRowDataCommon>
