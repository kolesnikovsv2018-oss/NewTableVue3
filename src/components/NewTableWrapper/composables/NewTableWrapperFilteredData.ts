import type { Ref } from "vue";
import { computed, ref, toValue, watch } from "vue";

import type { INewTableRow } from "../../NewTable/components/NewTableRow/types/NewTableRowTypes";
import type { INewTableFilter, INewTableFilters } from "../../NewTable/types/NewTableFilterTypes";

import { generateFilteredDataForNested } from "../../../helpers/generateFilteredDataForNested";

export function useNewTableWrapperFilteredData(
  initialData: Ref<INewTableRow[]> | INewTableRow[] | (() => INewTableRow[]),
  initialFilters: Ref<INewTableFilters> | INewTableFilters | (() => INewTableFilters) | undefined,
) {
  const filters = ref<INewTableFilters>(
    generateFilters(toValue(initialFilters || {}), null)
  );

  const filteredData = computed<INewTableRow[]>(
    () => generateFilteredData(toValue(initialData || []), filters.value),
  );

  watch(
    () => toValue(initialFilters),
    (newFilters) => {
      filters.value = generateFilters(newFilters, null);
      // filters.value = generateFilters(toValue(initialFilters || {}), filters.value);
    },
  );

  function generateFilters(
    filtersToGenerateFrom: INewTableFilters,
    currenFilters: INewTableFilters
  ): INewTableFilters {
    return Object.keys(filtersToGenerateFrom || {}).reduce(
      (acc: INewTableFilters, filterName: string): INewTableFilters => {
        const currentValue = filtersToGenerateFrom[filterName]?.currentValue !== undefined
          && filtersToGenerateFrom[filterName]?.currentValue !== null
          && (
            'isDefault' in filtersToGenerateFrom[filterName]
              ? !filtersToGenerateFrom[filterName].isDefault(
                filtersToGenerateFrom[filterName]?.currentValue,
                filtersToGenerateFrom[filterName]?.defaultValue
              )
              : filtersToGenerateFrom[filterName]?.currentValue !== filtersToGenerateFrom[filterName]?.defaultValue
          )
          ? filtersToGenerateFrom[filterName]?.currentValue
          : currenFilters?.[filterName]?.currentValue !== undefined
            && currenFilters?.[filterName]?.currentValue !== null
            && (
              'isDefault' in currenFilters[filterName]
                ? !currenFilters[filterName].isDefault(
                  currenFilters?.[filterName]?.currentValue,
                  filtersToGenerateFrom[filterName]?.defaultValue
                )
                : currenFilters?.[filterName]?.currentValue !== filtersToGenerateFrom[filterName]?.defaultValue
            )
            ? currenFilters?.[filterName]?.currentValue
            : filtersToGenerateFrom[filterName]?.defaultValue;

        acc[filterName] = {
          ...(filtersToGenerateFrom?.[filterName] || {}),
          // currentValue: filtersToGenerateFrom?.[filterName].currentValue,
          currentValue: currentValue,
        };

        return acc;
      },
      {},
    );
  }

  function resetFiltersToDefaultValues() {
    const currentFilters: Record<string, INewTableFilter> = filters.value;

    if (!Object.keys(currentFilters)) {
      return;
    }
    Object.keys(currentFilters).forEach(
      (filterName: string) => {
        currentFilters[filterName] = {
          ...currentFilters[filterName],
          currentValue: currentFilters[filterName].defaultValue,
        }
      }
    );
  }

  function resetFiltersToInitialValues() {
    const currentFilters: Record<string, INewTableFilter> = filters.value;

    if (!Object.keys(currentFilters)) {
      return;
    }
    Object.keys(currentFilters).forEach(
      (filterName: string) => {
        currentFilters[filterName] = {
          ...currentFilters[filterName],
          currentValue: currentFilters[filterName].initialValue,
        }
      }
    );
  }

  function generateFilteredData(
    currentData: INewTableRow[],
    currentFilters: Record<string, INewTableFilter>
  ): INewTableRow[] {
    if (!Object.keys(currentFilters)) {
      return currentData;
    }

    let resultData = currentData.map((row: INewTableRow) => row);

    Object.keys(currentFilters).forEach(
      (filterName: string) => {
        resultData = generateFilteredDataForNested(
          currentFilters[filterName],
          filterName,
          resultData,
        );
      }
    );

    return resultData;
  }

  return {
    filters,
    filteredData,
    resetFiltersToDefaultValues,
    resetFiltersToInitialValues,
    generateFilteredData,
  };
};