import type { Ref } from "vue";
import { ref, toValue } from "vue";

import type { IUseNewReestr } from "../NewReestr";
import type { INewTableRow } from "../../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";
import type { INewTableColumns } from "../../../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";
import type { INewTableActions } from "../../../../components/NewTable/types/NewTableActionTypes";
import type { INewReestrContexMenuItems } from "../../../../components/NewReestr/types/newReestrTypes";
import type { INewTableSorts } from "../../../../components/NewTable/types/NewTableFilterTypes";
import type { IUseNewReestrFilters } from "../NewReestrFilters";
import type { IUseNewReestrColumnSettings } from "../NewReestrColumnSettings";
import type { IUseSub1NewReestrActionsChangeModes } from "./Sub1NewReestrActionsChangeModes.js";
import type { IUseSub1NewReestrOnRowActions } from "./Sub1NewReestrOnRowActions";
import type { IUseSub1NewReestrContextMenu } from "./Sub1NewReestrContextMenu";
import type NewReestr from "../../../../components/NewReestr/NewReestr.vue";

import { useNewReestr } from "../NewReestr";
import { useNewReestrColumnSettings } from "../NewReestrColumnSettings";
import { useNewReestrFilters } from "../NewReestrFilters";
import { useSub1NewReestrActionsChangeModes } from "./Sub1NewReestrActionsChangeModes.js";
import { useSub1NewReestrApi } from "../../api/Sub1NewReestrApi";
import { useSub1NewReestrOnRowActions } from "./Sub1NewReestrOnRowActions";
import { useSub1NewReestrContextMenu } from "./Sub1NewReestrContextMenu";

export interface IUseSub1NewReestr extends
  IUseNewReestr,
  IUseNewReestrFilters,
  IUseNewReestrColumnSettings,
  IUseSub1NewReestrActionsChangeModes,
  IUseSub1NewReestrOnRowActions,
  IUseSub1NewReestrContextMenu {
  idFields: Ref<string[]>;
  data: Ref<INewTableRow[]>;
  columns: Ref<INewTableColumns>;
  actions: Ref<INewTableActions>;
  contextMenuItems: Ref<INewReestrContexMenuItems>;
  sorts: Ref<INewTableSorts>;
  initData: () => Promise<void>;
};

export function useSub1NewReestr(
  reestrName: Ref<string> | string | (() => string),
  newReestrRef: Ref<typeof NewReestr> | typeof NewReestr | (() => typeof NewReestr),
  count: (number | Ref<number> | (() => number)) = 10000,
  maxLevel: (number | Ref<number> | (() => number)) = 5,
  extraFieldCount: (number | Ref<number> | (() => number)) = 7,
  initialRowCount: (number | Ref<number> | (() => number)) = 10,
): IUseSub1NewReestr {
  const reestr = useNewReestr(
    reestrName,
    initialRowCount,
  );

  const idFields = ref<string[]>(['id']);

  const sub1NewReestrApiComposable = useSub1NewReestrApi();

  const data = ref<INewTableRow[]>([]);

  const columns = ref<INewTableColumns>({});

  const actions = ref<INewTableActions>({});

  const contextMenuItems = ref<INewReestrContexMenuItems>({});

  const newReestrFiltersComposable = useNewReestrFilters(
    () => toValue(reestrName),
    sub1NewReestrApiComposable,
  );

  const sorts = ref<INewTableSorts>({});

  const newReestrColumnSettingsComposable = useNewReestrColumnSettings(
    () => toValue(reestrName),
    () => columns.value,
    sub1NewReestrApiComposable,
    () => toValue(extraFieldCount),
  );

  const sub1NewReestrActionsChangeModesComposable = useSub1NewReestrActionsChangeModes();

  const sub1NewReestrOnRowActionsComposable = useSub1NewReestrOnRowActions(
    () => data.value,
    () => toValue(newReestrRef),
    idFields.value,
  );

  const sub1NewReestrContextMenuComposable = useSub1NewReestrContextMenu(
    () => toValue(newReestrRef),
    sub1NewReestrOnRowActionsComposable,
  )

  async function initData() {
    actions.value = await sub1NewReestrApiComposable.fetchActions();

    await sub1NewReestrActionsChangeModesComposable.initActionsChangeModes();

    columns.value = await sub1NewReestrApiComposable.fetchColumns({ extraFieldCount: toValue(extraFieldCount) });

    await newReestrColumnSettingsComposable.initColumnSettings();

    contextMenuItems.value = await sub1NewReestrApiComposable.fetchContextMenuItems();

    await newReestrFiltersComposable.initFilters();

    sorts.value = await sub1NewReestrApiComposable.fetchSorts();

    data.value = await sub1NewReestrApiComposable.fetchData({
      columns: columns.value,
      count: toValue(count),
      maxLevel: toValue(maxLevel),
    });
  }

  return {
    ...reestr,
    ...newReestrColumnSettingsComposable,
    ...newReestrFiltersComposable,
    ...sub1NewReestrActionsChangeModesComposable,
    ...sub1NewReestrOnRowActionsComposable,
    ...sub1NewReestrContextMenuComposable,

    idFields,
    actions,
    columns,
    data,
    contextMenuItems,
    sorts,
    initData,
  }
}
