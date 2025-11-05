import type { INewTableColumn, INewTableColumnSetting } from "../components/NewTableHeader/types/INewTableHeadTypes";

import { NEW_TABLE_DEFAULT_COLUMN_WIDTH } from "../constants/defaults";

/**
 * Генерирует ширины (для CSS включая px) колонок на основе видимых колонок и локальных настроек колонок
 * @param visibleSortedColumns - Видимые отсортированные колонки
 * @param localColumnsSettings - Локальные настройки колонок
 * @returns Объект с ширинами колонок
 */
export function generateColumnWidths(
  visibleSortedColumns: INewTableColumn[],
  localColumnsSettings: Record<string, INewTableColumnSetting>
): Record<string, string> {
  const widths: Record<string, string> = {};

  visibleSortedColumns.forEach((column) => {
    const localSetting = localColumnsSettings?.[column.key];
    if (localSetting?.width) {
      widths[column.key] = `${localSetting.width}px`;
    } else if (column.meta?.width) {
      widths[column.key] = `${column.meta.width}px`;
    } else {
      widths[column.key] = `${NEW_TABLE_DEFAULT_COLUMN_WIDTH}px`;
    }
  });

  return widths;
}
