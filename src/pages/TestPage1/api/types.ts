import type { INewTableColumnSettings } from "../../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";
import type { INewTableFilters } from "../../../components/NewTable/types/NewTableFilterTypes";

export interface IUseNewReestrFiltersApi {
  fetchFilters: () => Promise<INewTableFilters>;
};

export interface IUseNewReestrColumnSettingsApi {
  fetchColumnSettings: (payload: { extraFieldCount: number }) => Promise<INewTableColumnSettings>;
};