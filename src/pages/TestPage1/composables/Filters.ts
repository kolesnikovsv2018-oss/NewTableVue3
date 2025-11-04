import type { Ref } from "vue";
import { ref, toValue } from "vue";

import type { INewTableFilter, INewTableFilters } from "../../../components/NewTable/types/NewTableFilterTypes";

import { fetchFilters } from "../api/TestPage1Api";

export function useFilters(
  reestrName: Ref<string> | string | (() => string)
) {
  const filters = ref<INewTableFilters>({});

  function saveFiltersToLocalStorage() {
    localStorage.setItem(
      `${toValue(reestrName)}_filters`,
      JSON.stringify(filters.value)
    );
  }

  function loadFiltersFromLocalStorage() {
    const item = localStorage.getItem(
      `${toValue(reestrName)}_filters`
    );
    if (item) {
      filters.value = JSON.parse(item) as INewTableFilters;
    }
  }

  function updateFiltersForFetched(fetchedFilters: INewTableFilters) {
    const newFilters: INewTableFilters = {};

    Object.keys(fetchedFilters).forEach(
      (key: string) => {
        newFilters[key] = {
          ...(fetchedFilters[key] || {} as INewTableFilter),
          ...(filters.value[key] || {} as INewTableFilter),
        };
      }
    );

    filters.value = newFilters;
  }

  async function initFilters() {
    const fetchedFilters = await fetchFilters();

    // текущие настройки фильтров из localStorage
    loadFiltersFromLocalStorage();

    // обновляем фильтры, сохраняя текущие настройки
    // только для тех, которые пришли с сервера
    updateFiltersForFetched(fetchedFilters);

    // сохраняем обновленные фильтры в localStorage
    saveFiltersToLocalStorage();
  }

  return {
    filters,
    initFilters,
    saveFiltersToLocalStorage,
    loadFiltersFromLocalStorage,
  };
}
