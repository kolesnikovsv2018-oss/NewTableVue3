import type { Ref } from "vue";
import { computed, ref, toValue, watchEffect } from "vue";

import type { INewTableColumn, INewTableColumns, INewTableColumnSetting } from "../../NewTable/components/NewTableHeader/types/INewTableHeadTypes";

const NEW_TABLE_HEAD_MIN_WIDTH: number = 20;
const NEW_TABLE_HEAD_MAX_WIDTH: number = 500;

export function useNewTableWrapperColumns(
  initialColumns: Ref<INewTableColumns> | INewTableColumns | (() => INewTableColumns),
  initialColumnsSettings: Ref<Record<string, INewTableColumnSetting>> | Record<string, INewTableColumnSetting> | (() => Record<string, INewTableColumnSetting>),
) {
  const localColumnsSettings = ref<Record<string, INewTableColumnSetting>>(
    JSON.parse(JSON.stringify(toValue(initialColumnsSettings))),
  );

  watchEffect(() => {
    localColumnsSettings.value = JSON.parse(JSON.stringify(toValue(initialColumnsSettings)));
  });

  const columnsSortByOrder = computed<INewTableColumn[]>(
    () => {
      // чтобы не вызывать toValue много раз
      const localColumns = toValue(initialColumns);

      return Object.keys(localColumnsSettings.value)
        .sort((keyA, keyB) => {
          return localColumnsSettings.value[keyA].order - localColumnsSettings.value[keyB].order;
        })
        .map(
          (key) => localColumns[key],
        );
    }
  );

  const columnsSortByOrderVisible = computed<INewTableColumn[]>(
    () => {
      return columnsSortByOrder.value.filter(
        (col) => localColumnsSettings.value[col.key]?.visible !== false
      );
    }
  );

  function changeColumnOrders(columnFrom: string, columnTo: string) {
    if (
      !columnFrom
      || !columnTo
      || columnFrom === columnTo
    ) {
      return;
    }

    const fromOrder = localColumnsSettings.value?.[columnFrom].order;
    const toOrder = localColumnsSettings.value?.[columnTo].order;

    // слева-направо
    if (toOrder > fromOrder) {
      Object.keys(localColumnsSettings.value || {}).forEach(
        (columnName: string) => {
          if (!localColumnsSettings.value?.[columnName]) {
            return;
          }
          if (
            localColumnsSettings.value[columnName].order > fromOrder
            && localColumnsSettings.value[columnName].order <= toOrder
          ) {
            localColumnsSettings.value[columnName].order--;
          }
        }
      );
    }
    // справа-налево
    else {
      Object.keys(localColumnsSettings.value || {}).forEach(
        (columnName: string) => {
          if (!localColumnsSettings.value?.[columnName]) {
            return;
          }
          if (
            localColumnsSettings.value[columnName].order < fromOrder
            && localColumnsSettings.value[columnName].order >= toOrder
          ) {
            localColumnsSettings.value[columnName].order++;
          }
        }
      );
    }

    localColumnsSettings.value[columnFrom].order = toOrder;
  }

  function changeColumnWidths(columnName: string, delta: number, currentWidth: number) {
    const newWidth = currentWidth + delta;
    if (
      newWidth < NEW_TABLE_HEAD_MIN_WIDTH
      || newWidth > NEW_TABLE_HEAD_MAX_WIDTH
    ) {
      return;
    }
    localColumnsSettings.value = {
      ...localColumnsSettings.value,
      [columnName]: {
        ...localColumnsSettings.value[columnName],
        width: currentWidth + delta,
      },
    };
  }


  return {
    localColumnsSettings,
    columnsSortByOrder,
    columnsSortByOrderVisible,
    changeColumnOrders,
    changeColumnWidths,
  };
};