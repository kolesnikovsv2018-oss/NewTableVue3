import { Ref, ref, toValue } from "vue";

import type { INewTableRow } from "../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";
import type { INewTableColumn, INewTableHeaderSettings } from "../../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";
import type { INewTableActions } from "../../../components/NewTable/types/NewTableActionTypes";
import type { TNewTableActionsChangeModesStandart } from "../../../components/NewTable/types/NewTableActionsChangeModesTypes";
import type { INewReestrContexMenuItems } from "../../../components/NewReestr/types/newReestrContexMenuItems";
import type { INewTableFilters, INewTableSorts } from "../../../components/NewTable/types/NewTableFilterTypes";
import type { INewMenuItem } from "../../../components/NewContextMenu/types";

import { NEW_TABLE_STANDART_ROW_ACTIONS } from "../../../components/NewTableWrapper/constants/standartActions";
import { newTableStandartActionsChangeModes } from "../../../components/NewTableWrapper/constants/standartActionsChangeModes";
import {
  fetchActions,
  fetchActionsChangeModes,
  fetchColumns,
  fetchColumnsSettings,
  fetchContextMenuItems,
  fetchData,
  fetchFilters,
  fetchSideMenuItems,
  fetchSorts,
} from "../api/TestPage1Api";
import { NEW_TABLE_DEFAULT_ROW_TYPE } from "../../../components/NewTable/constants/defaultRowType";

export function useTestPage1NewReestrInitData(
  count: (number | Ref<number> | (() => number)) = 10000,
  maxLevel: (number | Ref<number> | (() => number)) = 5,
  extraFieldCount: (number | Ref<number> | (() => number)) = 7,
) {
  const data = ref<INewTableRow[]>([]);

  const columns = ref<INewTableColumn[]>([]);

  const columnsSettings = ref<INewTableHeaderSettings>({});

  const actions = ref<INewTableActions>({})

  const actionsChangeModes = ref<TNewTableActionsChangeModesStandart>({});

  const contextMenuItems = ref<INewReestrContexMenuItems>({});

  const sideMenuItems = ref<INewMenuItem[]>();

  const filters = ref<INewTableFilters>({});

  const sorts = ref<INewTableSorts>({});

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

    columnsSettings.value = await fetchColumnsSettings({ extraFieldCount: toValue(extraFieldCount) });

    contextMenuItems.value = await fetchContextMenuItems();

    sideMenuItems.value = await fetchSideMenuItems();

    filters.value = await fetchFilters();

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
    columnsSettings,
    data,
    contextMenuItems,
    sideMenuItems,
    filters,
    sorts,
    initData,
  }
}
