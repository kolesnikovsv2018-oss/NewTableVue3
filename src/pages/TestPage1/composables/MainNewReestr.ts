import type { Ref } from "vue";
import { ref, toValue } from "vue";

import type { INewTableRow } from "../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";
import type { INewTableColumns } from "../../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";
import type { INewTableActions } from "../../../components/NewTable/types/NewTableActionTypes";
import type { INewReestrContexMenuItems } from "../../../components/NewReestr/types/newReestrTypes";
import type { INewTableSorts } from "../../../components/NewTable/types/NewTableFilterTypes";
import type { INewMenuItem } from "../../../components/NewContextMenu/types";
import type { IUseNewReestrFilters } from "./NewReestrFilters";
import type { IUseNewReestrColumnSettings } from "./NewReestrColumnSettings";
import type { IUseMainNewReestrActionsChangeModes } from "./MainNewReestrActionsChangeModes";

import { useNewReestrColumnSettings } from "./NewReestrColumnSettings";
import { useNewReestrFilters } from "./NewReestrFilters";
import { useMainNewReestrApi } from "../api/MainNewReestrApi";
import { useMainNewReestrActionsChangeModes } from "./MainNewReestrActionsChangeModes";

export interface IUseMainNewReestr extends
  IUseNewReestrFilters,
  IUseNewReestrColumnSettings,
  IUseMainNewReestrActionsChangeModes {
  data: Ref<INewTableRow[]>;
  columns: Ref<INewTableColumns>;
  actions: Ref<INewTableActions>;
  contextMenuItems: Ref<INewReestrContexMenuItems>;
  sideMenuItems: Ref<INewMenuItem[] | undefined>;
  sorts: Ref<INewTableSorts>;
  rowCount: Ref<number>;
  initData: () => Promise<void>;
  loadReestrSettingsFromLocalStorage: () => void;
  saveReestrSettingsToLocalStorage: () => void;
};

export function useMainNewReestr(
  reestrName: Ref<string> | string | (() => string),
  count: (number | Ref<number> | (() => number)) = 10000,
  maxLevel: (number | Ref<number> | (() => number)) = 5,
  extraFieldCount: (number | Ref<number> | (() => number)) = 7,
  initialRowCount: (number | Ref<number> | (() => number)) = 10,
): IUseMainNewReestr {
  const mainNewReestrApiComposable = useMainNewReestrApi();

  const data = ref<INewTableRow[]>([]);

  const columns = ref<INewTableColumns>({});

  const actions = ref<INewTableActions>({});

  const contextMenuItems = ref<INewReestrContexMenuItems>({});

  const sideMenuItems = ref<INewMenuItem[]>();

  const newReestrFiltersComposable = useNewReestrFilters(
    () => toValue(reestrName),
    mainNewReestrApiComposable,
  );

  const sorts = ref<INewTableSorts>({});

  const rowCount = ref<number>(toValue(initialRowCount));

  const newReestrColumnSettingsComposable = useNewReestrColumnSettings(
    () => toValue(reestrName),
    () => columns.value,
    mainNewReestrApiComposable,
    () => toValue(extraFieldCount),
  );

  const mainNewReestrActionsChangeModesComposable = useMainNewReestrActionsChangeModes();

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
    actions.value = await mainNewReestrApiComposable.fetchActions();

    await mainNewReestrActionsChangeModesComposable.initActionsChangeModes();

    columns.value = await mainNewReestrApiComposable.fetchColumns({ extraFieldCount: toValue(extraFieldCount) });

    await newReestrColumnSettingsComposable.initColumnSettings();

    contextMenuItems.value = await mainNewReestrApiComposable.fetchContextMenuItems();

    sideMenuItems.value = await mainNewReestrApiComposable.fetchSideMenuItems();

    await newReestrFiltersComposable.initFilters();

    sorts.value = await mainNewReestrApiComposable.fetchSorts();

    data.value = await mainNewReestrApiComposable.fetchData({
      columns: columns.value,
      // count: toValue(rowCount),
      maxLevel: toValue(maxLevel),
    });
  }

  return {
    actions,
    columns,
    data,
    contextMenuItems,
    sideMenuItems,
    sorts,
    rowCount,
    initData,
    loadReestrSettingsFromLocalStorage,
    saveReestrSettingsToLocalStorage,

    ...newReestrColumnSettingsComposable,
    ...newReestrFiltersComposable,
    ...mainNewReestrActionsChangeModesComposable,
  }
}
