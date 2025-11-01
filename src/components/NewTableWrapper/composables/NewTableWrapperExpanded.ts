import { computed, Ref, toValue } from "vue";
import { INewTableRow } from "../../NewTable/components/NewTableRow/types/NewTableRowTypes";
import { NEW_TABLE_STANDART_ROW_MODES } from "../../NewTable/constants/standartRowModes";

export function useNewTableWrapperExpanded(
  modeIds: Ref<Record<string, Set<number | string>>> | Record<string, Set<number | string>> | (() => Record<string, Set<number | string>>),
  initialFlatData: Ref<INewTableRow[]> | INewTableRow[] | (() => INewTableRow[]),
) {
  const allRowWithChildrenIds = computed<(number | string)[]>(
    () => toValue(initialFlatData).filter(
      (row: INewTableRow) => !!row.children?.length,
    ).map(
      (row: INewTableRow) => row.data.id,
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