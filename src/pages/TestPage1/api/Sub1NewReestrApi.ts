import type { IUseNewReestrApi } from "./NewReestrApi";
import type { TNewTableActionsChangeModesStandart } from "../../../components/NewTable/types/NewTableActionsChangeModesTypes";
import type { INewTableColumns, INewTableColumnSettings } from "../../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";
import type { INewTableFilters, INewTableSorts } from "../../../components/NewTable/types/NewTableFilterTypes";
import type { INewReestrContexMenuItems } from "../../../components/NewReestr/types/newReestrTypes";
import type { IUseNewReestrColumnSettingsApi, IUseNewReestrFiltersApi } from "./types";

import { useNewReestrApi } from "./NewReestrApi";
import { testActionsChangeModes } from "../testdata/sub1/testSub1ActionsChangeModes";
import { generateExtraColumns, testColumns } from "../testdata/sub1/testSub1Columns";
import { generateExtraColumnsSettings, testColumnsSettings } from "../testdata/sub1/testSub1ColumnsSettings";
import { testFilters } from "../testdata/sub1/testSub1Filters";
import { testSorts } from "../testdata/sub1/testSub1Sorts";
import { testContextMenuItems } from "../testdata/sub1/testSub1ContextMenuItems";


export interface IUseSub1NewReestrApi extends
  IUseNewReestrApi,
  IUseNewReestrFiltersApi,
  IUseNewReestrColumnSettingsApi {
  fetchActionsChangeModes: () => Promise<TNewTableActionsChangeModesStandart>;
  fetchColumns: (payload: { extraFieldCount: number }) => Promise<INewTableColumns>;
  fetchSorts: () => Promise<INewTableSorts>;
  fetchContextMenuItems: () => Promise<INewReestrContexMenuItems>;
};

export function useSub1NewReestrApi(): IUseSub1NewReestrApi {
  const newReestrApi = useNewReestrApi();

  function fetchActionsChangeModes(): Promise<TNewTableActionsChangeModesStandart> {
    return new Promise((resolve) => {
      resolve(testActionsChangeModes);
    });
  }

  function fetchColumns(
    payload: { extraFieldCount: number },
  ): Promise<INewTableColumns> {
    return new Promise((resolve) => {
      const { extraFieldCount } = payload;

      const data = generateExtraColumns(
        testColumns,
        extraFieldCount
      );

      resolve(data);
    });
  }

  function fetchColumnSettings(
    payload: { extraFieldCount: number },
  ): Promise<INewTableColumnSettings> {
    return new Promise((resolve) => {
      const { extraFieldCount } = payload;

      const data = generateExtraColumnsSettings(
        testColumnsSettings,
        extraFieldCount,
      );

      resolve(data);
    });
  }

  function fetchFilters(): Promise<INewTableFilters> {
    return new Promise((resolve) => {
      resolve(testFilters);
    });
  }

  function fetchSorts(): Promise<INewTableSorts> {
    return new Promise((resolve) => {
      resolve(testSorts);
    });
  }

  function fetchContextMenuItems(): Promise<INewReestrContexMenuItems> {
    return new Promise((resolve) => {
      resolve(testContextMenuItems);
    });
  }

  return {
    ...newReestrApi,

    fetchActionsChangeModes,
    fetchColumns,
    fetchColumnSettings,
    fetchFilters,
    fetchSorts,
    fetchContextMenuItems,
  };
};
