import { Ref, ref, toValue } from "vue";

import type { INewTableRow } from "../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";

import { TEST_DATA_ROW_TYPES } from "../testdata/testData";
import {
  findAllParentRowsFor,
  findParentRowWithChildIndexByChildRowId,
  findRowById
} from "../../../helpers/finders";

export function useTestPage1NewReestrChangeRowParentId(
  initialData: Ref<INewTableRow[]> | INewTableRow[] | (() => INewTableRow[]),
) {
  const isChangeRowParentDialogShown = ref<boolean>(false);

  const activeDestinationRowId = ref<number>(null);

  const activeSourceRow = ref<INewTableRow>(null);

  /**
   * Так как в initialData могут быть большие данные,
   * то не клонируем их, а меняем напрямую, используем данные initialData!!!
   * @param sourceRow объект строки, который нужно переместить в дочерние элементы нового родителя
   * @param destinationRowId id нового родителя
   */
  function changeRowParent(
    sourceRow: INewTableRow,
    destinationRowId: number | string
  ): boolean {
    const destinationRow = findRowById(destinationRowId, toValue(initialData));

    if (!destinationRow) {
      console.warn('[changeRowParent] Wrong destinationRowId', destinationRowId);
      return false;
    }


    // проверим, если строка на 0-м уровне, то для неё не найлется ролитель
    // нужно найти в данных на самом верхнем уровне
    const idx = toValue(initialData).findIndex(
      (currentRow: INewTableRow) => String(currentRow.data.id) === String(sourceRow.data.id),
    );
    if (idx !== -1) {
      toValue(initialData).splice(idx, 1);
    } else {
      const sourceParentRow =
        findParentRowWithChildIndexByChildRowId(sourceRow.data.id, toValue(initialData));

      if (!sourceParentRow) {
        return false;
      }
      sourceParentRow.parent.children.splice(sourceParentRow.index, 1);
    }

    if (!destinationRow.children) {
      destinationRow.children = [];
    }
    destinationRow.children.push(sourceRow);
    if (destinationRow.meta.rowType === TEST_DATA_ROW_TYPES.TASK) {
      destinationRow.meta.rowType = TEST_DATA_ROW_TYPES.SUB_STAGE;
    }

    return true;
  }

  function onChangeRowParentId(newRowParentId: number) {
    isChangeRowParentDialogShown.value = false;
    activeDestinationRowId.value = newRowParentId;

    if (
      !activeDestinationRowId.value
      || !activeSourceRow.value?.data?.id
    ) {
      return;
    }

    const allParentIds = findAllParentRowsFor(activeDestinationRowId.value, toValue(initialData));

    if (allParentIds?.includes(String(activeSourceRow.value.data.id))) {
      console.warn('[onSubmitDestinationRowIdDialog] Loop parent!!!')
      alert('Warninh! Loop parent!')
      return;
    }

    changeRowParent(activeSourceRow.value, activeDestinationRowId.value);
  }

  return {
    isChangeRowParentDialogShown,
    activeDestinationRowId,
    activeSourceRow,
    changeRowParent,
    onChangeRowParentId,
  };
}