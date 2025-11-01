import type { INewTableColumnComponent, INewTableFilterComponent } from "../components/NewTableHeader/types/INewTableHeadTypes";
import type { INewTableRow } from "../components/NewTableRow/types/NewTableRowTypes";

export interface INewTableFilter {
  // для моделей фильтров и текщих значений вводимых пользователем
  currentValue: unknown;
  // последнее примененное значение фильтра для отображаемых данных
  initialValue?: unknown;
  // значения фильтра по умлочанию
  defaultValue?: unknown;
  // доступные значения, может быть списком доступных значений, диапазоном, максимальныс значением или др.
  availableValue?: unknown;
  // функция для проверки - соответствует ли значение в строке row в ячейке cellName значению фильтра filterValue
  compare?: (filterValue: unknown, cellName: string, row: INewTableRow, data?: INewTableRow[]) => boolean;
  // принимает текущее и вефолтное значение и сравнивает их
  // просто сравнить currentValue === defaultValue нельзя
  // например, в случае диапазона тут будут разные обеъкты с одинаковым содерижимым
  isDefault?: (currentValue: any, defaultValue: any) => boolean,
  // тоже самое для initial
  isInitial?: (currentValue: any, initialValue: any) => boolean,
  // имя и настройки компонента для фильтрации значений в колонке
  component?: INewTableFilterComponent;
}

export type INewTableFilters = Record<string, INewTableFilter>

export type INewTableSorts = Record<string, -1 | 0 | 1>