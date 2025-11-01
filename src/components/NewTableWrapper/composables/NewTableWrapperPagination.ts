import { computed, ref, Ref, toValue, watch } from "vue";

import type { INewTableRow } from '../../NewTable/components/NewTableRow/types/NewTableRowTypes';

const NEW_TABLE_STEP = 3;

export function useNewTablePagination(
  initialFlatData: INewTableRow[] | Ref<INewTableRow[]> | (() => INewTableRow[]),
  initialOnlyExpandedFlatData: INewTableRow[] | Ref<INewTableRow[]> | (() => INewTableRow[]),
) {
  const startIndex = ref(0);

  const rowCount = ref(10);

  const onlyExpandedFlatDataLength = computed<number>(
    () => toValue(initialOnlyExpandedFlatData).length
  );

  const flatDataToVew = computed(
    () => {
      return toValue(initialFlatData)
        .slice(toValue(startIndex), toValue(startIndex) + toValue(rowCount));
    }
  );

  const onlyExpandedFlatDataToView = computed(
    () => {
      return toValue(initialOnlyExpandedFlatData)
        .slice(toValue(startIndex), toValue(startIndex) + toValue(rowCount));
    }
  );

  watch(
    () => onlyExpandedFlatDataLength.value,
    () => {
      correctStartValue();
    },
  );

  function setRowCount(newRowCount: number) {
    rowCount.value = newRowCount;
  }

  function onPrevious() {
    startIndex.value = Math.max(0, startIndex.value - NEW_TABLE_STEP);
  }

  function onNext() {
    if (onlyExpandedFlatDataLength.value <= rowCount.value) {
      startIndex.value = 0;
      return;
    }

    startIndex.value = Math.min(
      onlyExpandedFlatDataLength.value - rowCount.value,
      startIndex.value + NEW_TABLE_STEP,
    );
  }

  function correctStartValue() {
    startIndex.value = Math.min(
      onlyExpandedFlatDataLength.value - rowCount.value,
      startIndex.value,
    );

    startIndex.value = Math.max(0, startIndex.value);
  }

  return {
    startIndex,
    rowCount,
    flatDataToVew: flatDataToVew,
    onlyExpandedFlatDataToView: onlyExpandedFlatDataToView,
    setRowCount,
    onPrevious,
    onNext,
    correctStartValue,
  }
}