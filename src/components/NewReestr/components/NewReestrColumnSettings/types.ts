import type { INewTableColumnSettings } from "../../../NewTable/components/NewTableHeader/types/INewTableHeadTypes";

export interface IChangeColumnSettingEvent {
  columnName: string;
  columnSettings: INewTableColumnSettings;
}
