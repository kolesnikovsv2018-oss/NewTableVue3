import { computed, ref, Ref, toValue, watch } from "vue";

import type { INewTableRow } from "../../NewTable/components/NewTableRow/types/NewTableRowTypes";
import type { INewTableSorts } from "../../NewTable/types/NewTableFilterTypes";

export function useNewTableWrapperSortData(
  data: Ref<INewTableRow[]> | INewTableRow[] | (() => INewTableRow[]),
  initialSorts: Ref<INewTableSorts> | INewTableSorts | (() => INewTableSorts),
) {
  const sorts = ref<INewTableSorts>(JSON.parse(JSON.stringify(toValue(initialSorts))));

  // пока сортировка реализована только по одному полю - первому встретившимуся в localSorts
  const sortFieldName = computed<string>(() => Object.keys(sorts.value || {})[0]);

  const sortDirection = computed<-1 | 0 | 1>(
    () => sortFieldName.value ? sorts.value[sortFieldName.value] || 0 : 0
  );

  const sortedData = computed<INewTableRow[]>(
    () => generateSortData(toValue(data), sortFieldName.value, sortDirection.value),
  );

  watch(
    () => toValue(initialSorts),
    () => {
      sorts.value = JSON.parse(JSON.stringify(toValue(initialSorts)));
    }
  );

  function generateSortData(dataToSort: INewTableRow[], fieldToSort: string, direction: -1 | 0 | 1): INewTableRow[] {
    // sortDirection.value может быть 0 - это без сортировки
    if (!fieldToSort || !direction) {
      return dataToSort;
    }

    // sort - изменяет сам исходный массив, из-за чего ссылка resultData === dataToSort.sort(...
    // и реактивность на сортировке внутренних эоементов не работает,
    // для этого создается новый массив через map
    const resultData = dataToSort?.map(
      (row: INewTableRow) => row,
    ).sort(
      (rowA: INewTableRow, rowB: INewTableRow) => {
        // сортировка в пряпоп направлении от меньшего к большему
        if (direction > 0) {
          if (rowA.data[fieldToSort] > rowB.data[fieldToSort]) return 1;
          if (rowA.data[fieldToSort] < rowB.data[fieldToSort]) return -1;
          return 0;
        }

        // иначе в обратном от большего к меньшему
        if (rowA.data[fieldToSort] < rowB.data[fieldToSort]) return 1;
        if (rowA.data[fieldToSort] > rowB.data[fieldToSort]) return -1;
        return 0;
      },
    );

    resultData.forEach(
      (sortedRow: INewTableRow) => {
        if (sortedRow.children?.length) {
          sortedRow.children = generateSortData(sortedRow.children, fieldToSort, direction);
        }
      }
    );

    return resultData;
  }

  return {
    sorts, // model data
    sortedData, // result
    sortFieldName, // readonly
    sortDirection, // readonly
    generateSortData, // service
  };
}
