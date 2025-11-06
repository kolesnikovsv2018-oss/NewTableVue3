import type { Ref } from "vue";
import { computed, toValue } from "vue";

import type { INewTableRow } from "../../NewTable/components/NewTableRow/types/NewTableRowTypes";

import { NEW_TABLE_STANDART_ROW_MODES } from "../../NewTable/constants/standartRowModes";
import { getComplexId } from "../../NewTable/helpers/getComplexId";

export function useNewTableWrapperExpanded(
  modeIds: Ref<Record<string, Set<number | string>>> | Record<string, Set<number | string>> | (() => Record<string, Set<number | string>>),
  initialFlatData: Ref<INewTableRow[]> | INewTableRow[] | (() => INewTableRow[]),
  idFields: string[] = ['id'],
) {
  const allRowWithChildrenIds = computed<(number | string)[]>(
    () => toValue(initialFlatData).filter(
      (row: INewTableRow) => !!row.children?.length,
    ).map(
      (row: INewTableRow) => getComplexId(row.data, idFields),
    ),
  );

  const isExpandedAll = computed<boolean>(
    () => !allRowWithChildrenIds.value?.length
      ? false
      : (allRowWithChildrenIds.value || []).every(
        (currentRowId: string | number) => !!toValue(modeIds)[NEW_TABLE_STANDART_ROW_MODES.EXPANDED]?.has(currentRowId),
      ),
  );

  function toggleExpandAllRow() {
    if (isExpandedAll.value) {
      toValue(modeIds)[NEW_TABLE_STANDART_ROW_MODES.EXPANDED] = null;
    } else {
      toValue(modeIds)[NEW_TABLE_STANDART_ROW_MODES.EXPANDED] = new Set<number | string>(allRowWithChildrenIds.value);
    }
  }

  return {
    allRowWithChildrenIds,
    isExpandedAll,
    toggleExpandAllRow,
  };
}