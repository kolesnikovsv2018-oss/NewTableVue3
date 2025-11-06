import { computed, ref } from "vue";

import type { INewTableRow } from "../../NewTable/components/NewTableRow/types/NewTableRowTypes";

import { NEW_TABLE_STANDART_ROW_MODES } from "../../NewTable/constants/standartRowModes";
import { getComplexId } from "../../NewTable/helpers/getComplexId";

export function useNewTableWrapperModes(
  idFields: string[] = ['id'],
) {
  const modeIds = ref<Record<string, Set<number | string>>>({});

  const editingIds = computed<Set<number | string> | undefined>(
    () => modeIds.value[NEW_TABLE_STANDART_ROW_MODES.EDIT]
  );
  const expandedIds = computed<Set<number | string> | undefined>(
    () => modeIds.value[NEW_TABLE_STANDART_ROW_MODES.EXPANDED]
  );
  const checkedIds = computed<Set<number | string> | undefined>(
    () => modeIds.value[NEW_TABLE_STANDART_ROW_MODES.CHECKED]
  );

  function switchOnModeForRow(mode: string, row: INewTableRow) {
    if (!modeIds.value[mode]) {
      modeIds.value[mode] = new Set();
    }
    modeIds.value[mode].add(getComplexId(row.data, idFields));
  }

  function switchOffModeForRow(mode: string, row: INewTableRow) {
    if (modeIds.value[mode]?.has(getComplexId(row.data, idFields))) {
      modeIds.value[mode].delete(getComplexId(row.data, idFields));
    }
  }

  function switchOnModeForRowWithChildren(mode: string, row: INewTableRow) {
    switchOnModeForRow(mode, row);

    if (row.children?.length) {
      row.children.forEach(
        (childRow: INewTableRow) => switchOnModeForRowWithChildren(mode, childRow),
      );
    }
  }

  function switchOffModeForRowWithChildren(mode: string, row: INewTableRow) {
    switchOffModeForRow(mode, row);

    if (row.children?.length) {
      row.children.forEach(
        (childRow: INewTableRow) => switchOffModeForRowWithChildren(mode, childRow),
      );
    }
  }

  function toggleModeForRow(mode: string, row: INewTableRow) {
    if (modeIds.value?.[mode]?.has(getComplexId(row.data, idFields))) {
      switchOffModeForRow(mode, row);
    } else {
      switchOnModeForRow(mode, row);
    }
  }

  function toggleModeForRowWithChildren(mode: string, row: INewTableRow) {
    if (modeIds.value?.[mode]?.has(getComplexId(row.data, idFields))) {
      switchOffModeForRowWithChildren(mode, row);
    } else {
      switchOnModeForRowWithChildren(mode, row);
    }
  }

  return {
    modeIds,
    editingIds,
    expandedIds,
    checkedIds,
    switchOnModeForRow,
    switchOffModeForRow,
    switchOnModeForRowWithChildren,
    switchOffModeForRowWithChildren,
    toggleModeForRow,
    toggleModeForRowWithChildren,
  };
}