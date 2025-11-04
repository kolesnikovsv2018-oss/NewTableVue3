import type { Ref } from "vue";
import { ref, toValue } from "vue";

import type { INewTableRow } from "../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";
import type { INewTableColumns, INewTableColumnSettings } from "../../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";
import type { INewTableActions } from "../../../components/NewTable/types/NewTableActionTypes";
import type { TNewTableActionsChangeModesStandart } from "../../../components/NewTable/types/NewTableActionsChangeModesTypes";
import type { INewReestrContexMenuItems } from "../../../components/NewReestr/types/newReestrTypes";
import type { INewTableFilters, INewTableSorts } from "../../../components/NewTable/types/NewTableFilterTypes";
import type { INewMenuItem } from "../../../components/NewContextMenu/types";

import { NEW_TABLE_STANDART_ROW_ACTIONS } from "../../../components/NewTableWrapper/constants/standartActions";
import { newTableStandartActionsChangeModes } from "../../../components/NewTableWrapper/constants/standartActionsChangeModes";
import {
  fetchActions,
  fetchActionsChangeModes,
  fetchColumns,
  fetchContextMenuItems,
  fetchData,
  fetchSideMenuItems,
  fetchSorts,
} from "../api/TestPage1Api";
import { NEW_TABLE_DEFAULT_ROW_TYPE } from "../../../components/NewTable/constants/defaultRowType";
import { useColumnSettings } from "./ColumnSettings";
import { useFilters } from "./Filters";

export interface IUseTestPage1NewReestrInitData {
  data: Ref<INewTableRow[]>;
  columns: Ref<INewTableColumns>;
  columnSettings: Ref<INewTableColumnSettings>;
  actions: Ref<INewTableActions>;
  actionsChangeModes: Ref<TNewTableActionsChangeModesStandart>;
  contextMenuItems: Ref<INewReestrContexMenuItems>;
  sideMenuItems: Ref<INewMenuItem[] | undefined>;
  filters: Ref<INewTableFilters>;
  sorts: Ref<INewTableSorts>;
  rowCount: Ref<number>;
  initData: () => Promise<void>;
  loadReestrSettingsFromLocalStorage: () => void;
  saveReestrSettingsToLocalStorage: () => void;
  loadColumnSettingsFromLocalStorage: () => void;
  saveColumnSettingsToLocalStorage: () => void;
  loadFiltersFromLocalStorage: () => void;
  saveFiltersToLocalStorage: () => void;
};

export function useReestr(
  reestrName: Ref<string> | string | (() => string),
  count: (number | Ref<number> | (() => number)) = 10000,
  maxLevel: (number | Ref<number> | (() => number)) = 5,
  extraFieldCount: (number | Ref<number> | (() => number)) = 7,
  initialRowCount: (number | Ref<number> | (() => number)) = 10,
): IUseTestPage1NewReestrInitData {
  const data = ref<INewTableRow[]>([]);

  const columns = ref<INewTableColumns>({});

  const actions = ref<INewTableActions>({})

  const actionsChangeModes = ref<TNewTableActionsChangeModesStandart>({});

  const contextMenuItems = ref<INewReestrContexMenuItems>({});

  const sideMenuItems = ref<INewMenuItem[]>();

  const {
    filters,
    initFilters,
    saveFiltersToLocalStorage,
    loadFiltersFromLocalStorage
  } = useFilters(
    () => toValue(reestrName),
  );

  const sorts = ref<INewTableSorts>({});

  const rowCount = ref<number>(toValue(initialRowCount));

  const {
    columnSettings,
    initColumnSettings,
    loadColumnSettingsFromLocalStorage,
    saveColumnSettingsToLocalStorage,
  } = useColumnSettings(
    () => toValue(reestrName),
    () => columns.value,
    () => toValue(extraFieldCount),
  );

  function saveReestrSettingsToLocalStorage() {
    const reestrSettings = {
      rowCount: rowCount.value,
    };

    localStorage.setItem(`${toValue(reestrName)}_settings`, JSON.stringify(reestrSettings));
  }

  function loadReestrSettingsFromLocalStorage() {
    const reestrSettingsJSON = localStorage.getItem(`${toValue(reestrName)}_settings`);

    if (reestrSettingsJSON) {
      const reestrSettings = JSON.parse(reestrSettingsJSON);
      rowCount.value = reestrSettings.rowCount;
    }
  }

  async function initData() {
    actions.value = await fetchActions();

    const localActionsChangeModes = {
      ...newTableStandartActionsChangeModes,
      ...(await fetchActionsChangeModes()),
    };

    actionsChangeModes.value = {
      ...localActionsChangeModes,
      [NEW_TABLE_DEFAULT_ROW_TYPE]: {
        ...(localActionsChangeModes[NEW_TABLE_DEFAULT_ROW_TYPE] || {}),
        [NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]: {
          on: [...(localActionsChangeModes[NEW_TABLE_DEFAULT_ROW_TYPE]?.[NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]?.on || []), 'changed'],
          off: localActionsChangeModes[NEW_TABLE_DEFAULT_ROW_TYPE]?.[NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]?.off || [],
        }
      },
    };

    columns.value = await fetchColumns({ extraFieldCount: toValue(extraFieldCount) });

    await initColumnSettings();

    contextMenuItems.value = await fetchContextMenuItems();

    sideMenuItems.value = await fetchSideMenuItems();

    await initFilters();

    sorts.value = await fetchSorts();

    data.value = await fetchData({
      count: toValue(count),
      maxLevel: toValue(maxLevel),
      extraFieldCount: toValue(extraFieldCount),
    });
  }

  return {
    actions,
    actionsChangeModes,
    columns,
    columnSettings,
    data,
    contextMenuItems,
    sideMenuItems,
    filters,
    sorts,
    rowCount,
    initData,
    loadReestrSettingsFromLocalStorage,
    saveReestrSettingsToLocalStorage,
    loadColumnSettingsFromLocalStorage,
    saveColumnSettingsToLocalStorage,
    loadFiltersFromLocalStorage,
    saveFiltersToLocalStorage,
  }
}
