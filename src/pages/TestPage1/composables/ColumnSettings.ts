import type { Ref } from "vue";
import { ref, toValue } from "vue";

import type { INewTableColumns, INewTableColumnSettings } from "../../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";

import { fetchColumnsSettings } from "../api/TestPage1Api";

const DEFAULT_COLUMN_WIDTH: number = 150;

export function useColumnSettings(
  reestrName: Ref<string> | string | (() => string) = "",
  initialColumns: Ref<INewTableColumns> | INewTableColumns | (() => INewTableColumns) = {},
  extraFieldCount: (number | Ref<number> | (() => number)) = 7,
) {
  const columnSettings = ref<INewTableColumnSettings>({});

  function saveColumnSettingsToLocalStorage() {
    localStorage.setItem(
      toValue(reestrName),
      JSON.stringify(columnSettings.value)
    );
  }

  function loadColumnSettingsFromLocalStorage() {
    const item = localStorage.getItem(toValue(reestrName));
    if (item) {
      columnSettings.value = JSON.parse(item) as INewTableColumnSettings;
    }
  }

  /**
   * Увеличивает порядок колонок, начиная с указанного,
   * но исключая увеличение первого вхождения этого порядка
   * @param {INewTableColumnSettings} columnSettingsToCorrect Колонки для коррекции
   * @param {number} startOrder Начальный порядок
   * @param {number} delta Сколько увеличить порядок
   * @returns {INewTableColumnSettings} Обновленные настройки колонок
   */
  function increaseOrdersFromExcludeFirst(
    columnSettingsToCorrect: INewTableColumnSettings,
    startOrder: number,
    delta: number = 1
  ): INewTableColumnSettings {
    let isNotFirst = false;

    Object.keys(columnSettingsToCorrect).forEach((key) => {
      if (
        columnSettingsToCorrect[key].order >= startOrder
      ) {
        if (
          columnSettingsToCorrect[key].order === startOrder
        ) {
          if (isNotFirst) {
            return;
          }
          isNotFirst = true;
        }
        columnSettingsToCorrect[key].order += delta;
      }
    });

    return columnSettingsToCorrect;
  }

  function generateOrdersSet(
    columnSettingsForGenerate: INewTableColumnSettings
  ): Set<number> {
    const orders = new Set<number>();

    Object.keys(columnSettingsForGenerate || {}).forEach((key) => {
      orders.add(columnSettingsForGenerate[key].order);
    });

    return orders;
  }

  function correctOrderInColumnSettings(
    columnSettingsToCorrect: INewTableColumnSettings
  ): INewTableColumnSettings {
    const alreadyReadyColumnSettings: INewTableColumnSettings = {};
    let maxOrder = 0;
    let orders = generateOrdersSet(alreadyReadyColumnSettings);

    Object.keys(columnSettingsToCorrect || {}).forEach((key) => {
      if (!columnSettingsToCorrect[key].order) {
        columnSettingsToCorrect[key].order = maxOrder + 1;
      }

      let currentOrder = columnSettingsToCorrect[key].order;

      if (orders.has(currentOrder)) {
        // если такой order уже есть,
        // то сдвигаем все остальные на один, кроме самого первого с таким order
        while (orders.has(currentOrder)) {
          increaseOrdersFromExcludeFirst(
            columnSettingsToCorrect,
            currentOrder,
          );
          currentOrder = columnSettingsToCorrect[key].order;
          orders = generateOrdersSet(alreadyReadyColumnSettings);
        }
      } else {
        orders.add(currentOrder);
      }

      maxOrder = Math.max(...Array.from(orders));

      alreadyReadyColumnSettings[key] = columnSettingsToCorrect[key];
    });

    return columnSettingsToCorrect;
  }

  function prepareColumnSettingsFromColumns(
    columnsToPrepare: INewTableColumns
  ) {
    const newSettings: INewTableColumnSettings = {};

    Object.keys(columnsToPrepare).forEach((key, index) => {
      newSettings[key] = {
        width: columnsToPrepare[key].meta?.width || DEFAULT_COLUMN_WIDTH,
        order: columnsToPrepare[key].meta?.order ?? index,
        visible: columnsToPrepare[key].meta?.visible ?? true,
      };
    });

    return correctOrderInColumnSettings(newSettings);
  }

  function mergeColumnSettings(
    oldColumnSettings: INewTableColumnSettings,
    newColumnSettings: INewTableColumnSettings,
  ) {
    return Object.keys(oldColumnSettings).reduce(
      (acc, key): INewTableColumnSettings => {
        acc[key] = {
          ...oldColumnSettings[key],
          ...newColumnSettings[key],
        };
        return acc;
      },
      {} as INewTableColumnSettings
    );
  }

  async function initColumnSettings() {
    const preparedColumnSettingsFromColumns = prepareColumnSettingsFromColumns(toValue(initialColumns));

    const columnSettingsFromServer = await fetchColumnsSettings({ extraFieldCount: toValue(extraFieldCount) });

    // меняет columnSettings.value на загруженные из localStorage
    loadColumnSettingsFromLocalStorage();

    columnSettings.value = mergeColumnSettings(
      mergeColumnSettings(
        preparedColumnSettingsFromColumns,
        columnSettingsFromServer,
      ),
      columnSettings.value,
    );

    saveColumnSettingsToLocalStorage();
  }

  return {
    columnSettings,
    saveColumnSettingsToLocalStorage,
    loadColumnSettingsFromLocalStorage,
    initColumnSettings,
    prepareColumnSettingsFromColumns,
    mergeColumnSettings,
  };
}