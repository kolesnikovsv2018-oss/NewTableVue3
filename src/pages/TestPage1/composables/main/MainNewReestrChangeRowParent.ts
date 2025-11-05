import type { Ref } from "vue";
import { ref } from "vue";

import type { INewTableRow } from "../../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";

import { TEST_DATA_ROW_TYPES } from "../../testdata/testNewReestrData";
import {
  findAllParentRowsFor,
  findParentRowWithChildIndexByChildRowId,
  findRowById
} from "../../../../helpers/finders";
import type { IUseMainNewReestr } from "./MainNewReestr";

export interface IUseMainNewReestrChangeRowParent {
  activeRowForChangeParent: Ref<INewTableRow>;
  onChangeRowParentId: (newRowParentId: number) => void;
};

export function useMainNewReestrChangeRowParent(
  mainReestr: IUseMainNewReestr,
): IUseMainNewReestrChangeRowParent {
  const initialData = ref<INewTableRow[]>(mainReestr.data.value);

  const activeRowForChangeParent = ref<INewTableRow>(null);

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
    const destinationRow = findRowById(destinationRowId, initialData.value);

    if (!destinationRow) {
      console.warn('[changeRowParent] Wrong destinationRowId', destinationRowId);
      return false;
    }


    // проверим, если строка на 0-м уровне, то для неё не найлется ролитель
    // нужно найти в данных на самом верхнем уровне
    const idx = initialData.value.findIndex(
      (currentRow: INewTableRow) => String(currentRow.data.id) === String(sourceRow.data.id),
    );
    if (idx !== -1) {
      initialData.value.splice(idx, 1);
    } else {
      const sourceParentRow =
        findParentRowWithChildIndexByChildRowId(sourceRow.data.id, initialData.value);

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
    if (
      !newRowParentId
      || !activeRowForChangeParent.value?.data?.id
    ) {
      return;
    }

    const allParentIds = findAllParentRowsFor(newRowParentId, initialData.value);

    if (allParentIds?.includes(String(activeRowForChangeParent.value.data.id))) {
      console.warn('[onSubmitDestinationRowIdDialog] Loop parent!!!')
      alert('Warninh! Loop parent!')
      return;
    }

    changeRowParent(activeRowForChangeParent.value, newRowParentId);

    activeRowForChangeParent.value = null;
  }

  return {
    activeRowForChangeParent,
    onChangeRowParentId,
  };
}