import type { INewTableColumns, INewTableColumnSettings } from "../../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";
import type { INewTableRow } from "../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";
import type { INewTableActions } from "../../../components/NewTable/types/NewTableActionTypes";
import type { TNewTableActionsChangeModesStandart } from "../../../components/NewTable/types/NewTableActionsChangeModesTypes";
import type { INewReestrContexMenuItems } from "../../../components/NewReestr/types/newReestrTypes";
import type { INewTableFilters, INewTableSorts } from "../../../components/NewTable/types/NewTableFilterTypes";

import { generateExtraColumns, testColumns } from "../testdata/testMainColumns";
import { generateLargeTestData } from "../testdata/testMainData";
import { newTableStandartActions } from "../../../components/NewTableWrapper/constants/standartActions";
import { generateExtraColumnsSettings, testColumnsSettings } from "../testdata/testMainColumnsSettings";
import { testActionsChangeModes } from "../testdata/testMainActionsChangeModes";
import { testContextMenuItems } from "../testdata/testMainContextMenuItems";
import { testFilters } from "../testdata/testMainFilters";
import { testSorts } from "../testdata/testMainSorts";

export interface IUseNewReestrApi {
  fetchActions: () => Promise<INewTableActions>;
  fetchActionsChangeModes: () => Promise<TNewTableActionsChangeModesStandart>;
  fetchColumns: (payload: { extraFieldCount: number }) => Promise<INewTableColumns>;
  fetchColumnsSettings: (payload: { extraFieldCount: number }) => Promise<INewTableColumnSettings>;
  fetchData: (payload: { count: number, maxLevel: number, extraFieldCount: number }) => Promise<INewTableRow[]>;
  fetchContextMenuItems: () => Promise<INewReestrContexMenuItems>;
  fetchFilters: () => Promise<INewTableFilters>;
  fetchSorts: () => Promise<INewTableSorts>;
};

export function useNewReestrApi(): IUseNewReestrApi {
  function fetchActions(): Promise<INewTableActions> {
    return new Promise((resolve) => {
      resolve(newTableStandartActions);
    });
  }

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

  function fetchColumnsSettings(
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

  function fetchData(
    payload: { count: number, maxLevel: number, extraFieldCount: number },
  ): Promise<INewTableRow[]> {
    return new Promise((resolve) => {
      const { count, maxLevel, extraFieldCount } = payload;

      const data = generateLargeTestData(count, maxLevel, extraFieldCount);
      resolve(data);
    });
  }

  function fetchContextMenuItems(): Promise<INewReestrContexMenuItems> {
    return new Promise((resolve) => {
      resolve(testContextMenuItems);
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

  return {
    fetchActions,
    fetchActionsChangeModes,
    fetchColumns,
    fetchColumnsSettings,
    fetchData,
    fetchContextMenuItems,
    fetchFilters,
    fetchSorts,
  };
};
