import type { Ref } from "vue";
import { ref, toValue } from "vue";

import type { IUseNewReestr } from "../NewReestr";
import type { INewTableRow } from "../../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";
import type { INewTableColumns } from "../../../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";
import type { INewTableActions } from "../../../../components/NewTable/types/NewTableActionTypes";
import type { INewReestrContexMenuItems } from "../../../../components/NewReestr/types/newReestrTypes";
import type { INewTableSorts } from "../../../../components/NewTable/types/NewTableFilterTypes";
import type { INewMenuItem } from "../../../../components/NewContextMenu/types";
import type { IUseNewReestrFilters } from "../NewReestrFilters";
import type { IUseNewReestrColumnSettings } from "../NewReestrColumnSettings";
import type { IUseMainNewReestrActionsChangeModes } from "./MainNewReestrActionsChangeModes.js";
import type { IUseMainNewReestrOnRowActions } from "./MainNewReestrOnRowActions";
import type { IUseMainNewReestrContextMenu } from "./MainNewReestrContextMenu";
import type { IUseMainNewReestrSideMenu } from "./MainNewReestrSideMenu";
import type NewReestr from "../../../../components/NewReestr/NewReestr.vue";

import { useNewReestr } from "../NewReestr";
import { useNewReestrColumnSettings } from "../NewReestrColumnSettings";
import { useNewReestrFilters } from "../NewReestrFilters";
import { useMainNewReestrApi } from "../../api/MainNewReestrApi";
import { useMainNewReestrActionsChangeModes } from "./MainNewReestrActionsChangeModes.js";
import { useMainNewReestrOnRowActions } from "./MainNewReestrOnRowActions";
import { useMainNewReestrContextMenu } from "./MainNewReestrContextMenu";
import { useMainNewReestrSideMenu } from "./MainNewReestrSideMenu";

export interface IUseMainNewReestr extends
  IUseNewReestr,
  IUseNewReestrFilters,
  IUseNewReestrColumnSettings,
  IUseMainNewReestrActionsChangeModes,
  IUseMainNewReestrOnRowActions,
  IUseMainNewReestrContextMenu,
  IUseMainNewReestrSideMenu {
  idFields: Ref<string[]>;
  data: Ref<INewTableRow[]>;
  columns: Ref<INewTableColumns>;
  actions: Ref<INewTableActions>;
  contextMenuItems: Ref<INewReestrContexMenuItems>;
  sideMenuItems: Ref<INewMenuItem[] | undefined>;
  sorts: Ref<INewTableSorts>;
  initData: () => Promise<void>;
};

export function useMainNewReestr(
  reestrName: Ref<string> | string | (() => string),
  newReestrRef: Ref<typeof NewReestr> | typeof NewReestr | (() => typeof NewReestr),
  count: (number | Ref<number> | (() => number)) = 10000,
  maxLevel: (number | Ref<number> | (() => number)) = 5,
  extraFieldCount: (number | Ref<number> | (() => number)) = 7,
  initialRowCount: (number | Ref<number> | (() => number)) = 10,
): IUseMainNewReestr {
  const newReestrComposable = useNewReestr(
    reestrName,
    initialRowCount,
  );
  const idFields = ref<string[]>(['id', 'name']);

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

  const newReestrColumnSettingsComposable = useNewReestrColumnSettings(
    () => toValue(reestrName),
    () => columns.value,
    mainNewReestrApiComposable,
    () => toValue(extraFieldCount),
  );

  const mainNewReestrActionsChangeModesComposable = useMainNewReestrActionsChangeModes();

  const mainNewReestrOnRowActionsComposable = useMainNewReestrOnRowActions(
    () => data.value,
    () => toValue(newReestrRef),
    idFields.value,
  );

  const mainNewReestrContextMenuComposable = useMainNewReestrContextMenu(
    () => toValue(newReestrRef),
    mainNewReestrOnRowActionsComposable,
  );

  const mainNewReestrSideMenuComposable = useMainNewReestrSideMenu(
    newReestrFiltersComposable,
  );

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
      count: toValue(count),
      maxLevel: toValue(maxLevel),
    });
  }

  return {
    ...newReestrComposable,
    ...newReestrColumnSettingsComposable,
    ...newReestrFiltersComposable,
    ...mainNewReestrActionsChangeModesComposable,
    ...mainNewReestrOnRowActionsComposable,
    ...mainNewReestrContextMenuComposable,
    ...mainNewReestrSideMenuComposable,

    idFields,
    actions,
    columns,
    data,
    contextMenuItems,
    sideMenuItems,
    sorts,
    initData,
  }
}
