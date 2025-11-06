import type { Ref } from "vue";
import { computed, toValue } from "vue";

import type { INewTableRow } from "../../NewTable/components/NewTableRow/types/NewTableRowTypes";

import { NEW_TABLE_STANDART_ROW_MODES } from "../../NewTable/constants/standartRowModes";
import { getComplexId } from "../../NewTable/helpers/getComplexId";

export function useNewTableWrapperChecked(
  modeIds: Ref<Record<string, Set<number | string>>> | Record<string, Set<number | string>> | (() => Record<string, Set<number | string>>),
  initialFlatData: Ref<INewTableRow[]> | INewTableRow[] | (() => INewTableRow[]),
  idFields: string[] = ['id'],
) {
  const allRowIds = computed<(number | string)[]>(
    () => toValue(initialFlatData).map(
      (row: INewTableRow) => getComplexId(row.data, idFields),
    ),
  );

  const isCheckedAll = computed<boolean>(
    () => !allRowIds.value?.length
      ? false
      : (allRowIds.value || []).every(
        (currentRowId: string | number) => !!toValue(modeIds)[NEW_TABLE_STANDART_ROW_MODES.CHECKED]?.has(currentRowId),
      ),
  );

  function toggleCheckAllRow() {
    if (isCheckedAll.value) {
      toValue(modeIds)[NEW_TABLE_STANDART_ROW_MODES.CHECKED] = null;
    } else {
      toValue(modeIds)[NEW_TABLE_STANDART_ROW_MODES.CHECKED] = new Set<number | string>(allRowIds.value);
    }
  }

  return {
    allRowIds,
    isCheckedAll,
    toggleCheckAllRow,
  };
}