import type { Ref } from "vue";
import { ref, toValue } from "vue";

import type { INewTableFilter, INewTableFilters } from "../../../components/NewTable/types/NewTableFilterTypes";
import type { IUseNewReestrFiltersApi } from "../api/types";

export interface IUseNewReestrFilters {
  filters: Ref<INewTableFilters>;
  setFilter: (params: { name: string; value: unknown }) => void;
  initFilters: () => Promise<void>;
  saveFiltersToLocalStorage: () => void;
  loadFiltersFromLocalStorage: () => void;
};

export function useNewReestrFilters(
  reestrName: Ref<string> | string | (() => string),
  api: IUseNewReestrFiltersApi,
): IUseNewReestrFilters {
  const filters = ref<INewTableFilters>({});

  function setFilter(
    { name, value }: { name: string; value: unknown },
  ) {
    filters.value = {
      ...(filters.value || {} as INewTableFilters),
      [name]: {
        ...(filters.value?.[name] || {} as INewTableFilter),
        currentValue: value,
      }
    };
  }

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
    const fetchedFilters = await api.fetchFilters();

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
    setFilter,
    initFilters,
    saveFiltersToLocalStorage,
    loadFiltersFromLocalStorage,
  };
}
