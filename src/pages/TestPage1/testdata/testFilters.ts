import type { INewTableFilter, INewTableFilters } from "../../../components/NewTable/types/NewTableFilterTypes";
import type { INewTableRow } from "../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";
import type { ITestRangeDate } from "../../../components/FilterComponents/components/types";

import { NEW_TABLE_STANDART_ROW_MODES } from "../../../components/NewTable/constants/standartRowModes";
import { compareFilterAsString } from "../../../helpers/compareFilterAsString";
import { statusOptions } from "./testColumns";

function generateEmptyTextFilter(): INewTableFilter {
  return {
    // для моделей фильтров и текщих значений вводимых пользователем
    currentValue: '',
    // последнее примененное значение фильтра для отображаемых данных
    initialValue: '',
    // значения фильтра по умлочанию
    defaultValue: '',
    // доступные значения, может быть списком доступных значений, диапазоном, максимальныс значением или др.
    availableValue: null,
    // функция для проверки - соответствует ли значение в строке row в ячейке cellName значению фильтра filterValue
    compare: (
      filterValue: string,
      cellName: string,
      row: INewTableRow,
      // data: INewTableRow[], // как пример, может передаваться перелаваться в другие функции сравнения
    ) => compareFilterAsString(filterValue, row.data[cellName] as string),
    component: {
      name: 'FilterTextComponent',
      changeEventName: 'input',
      props: {
        mode: NEW_TABLE_STANDART_ROW_MODES.EDIT,
      },
    },
  }
}

export const testFilters: INewTableFilters = {
  id: {
    ...generateEmptyTextFilter(),
  },
  name: {
    ...generateEmptyTextFilter(),
  },

  date: {
    currentValue: { date1: null, date2: null },
    defaultValue: { date1: null, date2: null },
    compare: (
      filterValue: { date1: string, date2: string },
      cellName: string,
      row: INewTableRow,
      // data: INewTableRow[], // как пример, может передаваться в функции сравнения других фильтров
    ) => (!filterValue?.date1 || filterValue.date1 <= row.data[cellName])
      && (!filterValue?.date2 || row.data[cellName] <= filterValue.date2),

    isDefault: (currentValue: ITestRangeDate, defaultValue: ITestRangeDate) =>
      currentValue === defaultValue
      || (
        currentValue.date1 === defaultValue.date1
        && currentValue.date2 === defaultValue.date2
      ),
    isInitial: (currentValue: ITestRangeDate, initialValue: ITestRangeDate) =>
      currentValue === initialValue
      || (
        currentValue.date1 === initialValue.date1
        && currentValue.date2 === initialValue.date2
      ),

    component: {
      name: 'FilterDateRangeComponent',
      props: {},
      changeEventName: 'update:value',
    },
  },



  status: {
    currentValue: null,
    defaultValue: null,
    compare: (
      filterValue: string[],
      cellName: string,
      row: INewTableRow,
      // data: INewTableRow[], // как пример, может передаваться перелаваться в другие функции сравнения
    ) => filterValue.includes(row.data[cellName] as string),
    component: {
      name: 'FilterSelectComponent',
      props: {
        options: statusOptions,
        multiple: true,
      },
      changeEventName: 'update:value',
    },
  },
}