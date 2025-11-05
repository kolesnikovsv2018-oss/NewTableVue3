import type { INewMenuItem } from "../../../components/NewContextMenu/types";
import type { IUseNewReestrApi } from "./NewReestrApi";
import type { TNewTableActionsChangeModesStandart } from "../../../components/NewTable/types/NewTableActionsChangeModesTypes";
import type { INewTableColumns, INewTableColumnSettings } from "../../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";
import type { INewTableFilters, INewTableSorts } from "../../../components/NewTable/types/NewTableFilterTypes";
import type { INewReestrContexMenuItems } from "../../../components/NewReestr/types/newReestrTypes";
import type { IUseNewReestrColumnSettingsApi, IUseNewReestrFiltersApi } from "./types";

import { useNewReestrApi } from "./NewReestrApi";

import { testActionsChangeModes } from "../testdata/main/testMainActionsChangeModes";
import { generateExtraColumns, testColumns } from "../testdata/main/testMainColumns";
import { generateExtraColumnsSettings, testColumnsSettings } from "../testdata/main/testMainColumnsSettings";
import { testFilters } from "../testdata/main/testMainFilters";
import { testSorts } from "../testdata/main/testMainSorts";
import { testContextMenuItems } from "../testdata/main/testMainContextMenuItems";
import { testSideMenuItems } from "../testdata/main/testMainSideMenuItems";

export interface IUseMainNewReestrApi extends
  IUseNewReestrApi,
  IUseNewReestrFiltersApi,
  IUseNewReestrColumnSettingsApi {
  fetchActionsChangeModes: () => Promise<TNewTableActionsChangeModesStandart>;
  fetchColumns: (payload: { extraFieldCount: number }) => Promise<INewTableColumns>;
  fetchSorts: () => Promise<INewTableSorts>;
  fetchContextMenuItems: () => Promise<INewReestrContexMenuItems>;
  fetchSideMenuItems: () => Promise<INewMenuItem[]>;
};

export function useMainNewReestrApi(): IUseMainNewReestrApi {
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

  function fetchSideMenuItems(): Promise<INewMenuItem[]> {
    return new Promise((resolve) => {
      resolve(testSideMenuItems);
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
    fetchSideMenuItems,
  };
};
