import type { INewTableColumnSettings } from "@/components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";

export interface IChangeColumnSettingEvent {
  columnName: string;
  columnSettings: INewTableColumnSettings;
}
