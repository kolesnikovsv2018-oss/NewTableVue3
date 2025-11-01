import type { INewTableHeaderSetting } from "../NewTable/components/NewTableHeader/types/INewTableHeadTypes";

export interface IChangeColumnSettingsEvent {
  columnName: string;
  columnsSettings: INewTableHeaderSetting;
}
