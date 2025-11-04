import type { Ref } from "vue";
import { computed, ref, toValue, watch } from "vue";

import type { INewTableRow } from '../../NewTable/components/NewTableRow/types/NewTableRowTypes';

const NEW_TABLE_STEP = 3;

export function useNewTablePagination(
  initialFlatData: INewTableRow[] | Ref<INewTableRow[]> | (() => INewTableRow[]),
  initialOnlyExpandedFlatData: INewTableRow[] | Ref<INewTableRow[]> | (() => INewTableRow[]),
  rowCount: number | Ref<number> | (() => number),
) {
  const startIndex = ref(0);

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

  function onPrevious() {
    startIndex.value = Math.max(0, startIndex.value - NEW_TABLE_STEP);
  }

  function onNext() {
    if (onlyExpandedFlatDataLength.value <= toValue(rowCount)) {
      startIndex.value = 0;
      return;
    }

    startIndex.value = Math.min(
      onlyExpandedFlatDataLength.value - toValue(rowCount),
      startIndex.value + NEW_TABLE_STEP,
    );
  }

  function correctStartValue() {
    startIndex.value = Math.min(
      onlyExpandedFlatDataLength.value - toValue(rowCount),
      startIndex.value,
    );

    startIndex.value = Math.max(0, startIndex.value);
  }

  return {
    startIndex,
    rowCount,
    flatDataToVew: flatDataToVew,
    onlyExpandedFlatDataToView: onlyExpandedFlatDataToView,
    onPrevious,
    onNext,
    correctStartValue,
  }
}