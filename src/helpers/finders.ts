import type { INewTableRow } from "../components/NewTable/components/NewTableRow/types/NewTableRowTypes";

export type TFindParentRowWithChildIndexByChildRowId = { parent: INewTableRow, index: number };

// export function findRowByFields(
//   complexRowId: Record<string, unknown>,
//   rows: INewTableRow[],
//   fields: string[], // поля, по которым нужно искать
// ): INewTableRow | undefined {
//   const originalRowFieldValues = fields.map((field: string) => complexRowId[field]);

//   const findedRow = rows.find(
//     (row: INewTableRow) => {
//       const currentRowIdValues: unknown[] = fields.map((field: string) => row.data[field]);
//       return currentRowIdValues.toString() === originalRowFieldValues.toString();
//     },
//   );

//   if (!findedRow) {
//     for (const row of rows) {
//       if (row.children?.length) {
//         const childRow = findRowById(complexRowId, row.children);
//         if (childRow) {
//           return childRow;
//         }
//       }
//     }
//   } else {
//     return findedRow;
//   }
// }

/**
 * Поиск строки по составному ID
 * @param {Record<string, unknown>} complexRowId Составной ID строки, например: { idPart1: 1, idPart2: 'A' }
 * @param {INewTableRow[]} rows Все данные, в которых нужно провести поиск
 * @param {string[]} idFields Поля, из которых состоит составной ID
 * @returns {INewTableRow | undefined} Найденная строка или undefined, если строка не найдена
 */
export function findRowById(
  complexRowId: Record<string, unknown>,
  rows: INewTableRow[],
  idFields: string[] = ['id'], // поля, из которых состоит составной ID
): INewTableRow | undefined {
  const originalRowIdValues = idFields.map((field: string) => complexRowId[field]);

  const findedRow = rows.find(
    (row: INewTableRow) => {
      const currentRowIdValues: unknown[] = idFields.map((field: string) => row.data[field]);
      return currentRowIdValues.toString() === originalRowIdValues.toString();
    },
  );

  if (!findedRow) {
    for (const row of rows) {
      if (row.children?.length) {
        const childRow = findRowById(complexRowId, row.children);
        if (childRow) {
          return childRow;
        }
      }
    }
  } else {
    return findedRow;
  }
}

/**
 * находит массив, в котором содержится искомый rowId
 * @param complexRowId искомый rowId, составной ID для строки, например: { idPart1: 1, idPart2: 'A' }
 * @param rows все данные, в которых нужно провести поиск
 * @param idFields поля, из которых состоит составной ID
 * @returns {INewTableRow[] | undefined} Найденные строки или undefined, если строки не найдены
 */
export function findParentRowsById(
  complexRowId: Record<string, unknown>,
  rows: INewTableRow[],
  idFields: string[] = ['id'], // поля, из которых состоит составной ID
): INewTableRow[] | undefined {
  const originalRowIdValues = idFields.map((field: string) => complexRowId[field]);

  const findedRow = rows.find(
    (row: INewTableRow) => {
      const currentRowIdValues: unknown[] = idFields.map((field: string) => row.data[field]);
      return currentRowIdValues.toString() === originalRowIdValues.toString();
    }
  );

  if (!findedRow) {
    for (const row of rows) {
      if (row.children?.length) {
        const childRows = findParentRowsById(complexRowId, row.children);
        if (childRows) {
          return childRows;
        }
      }
    }
  } else {
    return rows;
  }
}

/**
 * Поиск родительской строки и индекса дочерней строки по составному ID дочерней строки
 * @param {Record<string, unknown>} childComplexRowId Составной ID дочерней строки, например: { idPart1: 1, idPart2: 'A' }
 * @param {INewTableRow[]} rows Все данные, в которых нужно провести поиск
 * @param {string[]} idFields Поля, из которых состоит составной ID
 * @returns {TFindParentRowWithChildIndexByChildRowId | undefined} Найденная родительская строка и индекс дочерней строки или undefined, если не найдено
 */
export function findParentRowWithChildIndexByChildRowId(
  childComplexRowId: Record<string, unknown>,
  rows: INewTableRow[],
  idFields: string[] = ['id'], // поля, из которых состоит составной ID
): TFindParentRowWithChildIndexByChildRowId | undefined {
  for (const row of rows) {
    if (!row.children?.length) {
      continue;
    }

    const originalRowIdValues: unknown[] = idFields.map((field: string) => childComplexRowId[field]);

    const childIndex: number = row.children.findIndex(
      (r: INewTableRow): boolean => {
        const currentRowIdValues: unknown[] = idFields.map((field: string) => r.data[field]);
        return currentRowIdValues.toString() === originalRowIdValues.toString();
      },
    );

    if (childIndex !== -1) {
      return {
        parent: row,
        index: childIndex
      };
    }

    const parentRowWithChildIndex = findParentRowWithChildIndexByChildRowId(childComplexRowId, row.children);
    if (parentRowWithChildIndex) {
      return parentRowWithChildIndex;
    }
  }
}

/**
 * Поиск всех родительских строк для заданной строки по составному ID
 * @param checkingComplexRowId Составной ID строки, для которой нужно найти родительские строки
 * @param data Все данные, в которых нужно провести поиск
 * @param idFields Поля, из которых состоит составной ID
 * @returns Массив найденных родительских строк или пустой массив, если не найдено
 */
export function findAllParentRowsFor(
  checkingComplexRowId: Record<string, unknown>,
  data: INewTableRow[],
  idFields: string[] = ['id'], // поля, из которых состоит составной ID
): string[] {
  const resArr: string[] = [];

  const findParent = (complexRowId: Record<string, unknown>, currentData: INewTableRow[]) => {
    for (const currentRow of currentData) {
      const currentRowIdValues: unknown[] = idFields.map((field: string) => currentRow.data[field]);

      if (currentRow.children?.find(
        (currentChildRow: INewTableRow) => {
          const currentChildRowIdValues: unknown[] = idFields.map((field: string) => currentChildRow.data[field]);
          return currentChildRowIdValues.toString() === complexRowId.toString();
        }
      )) {
        resArr.push(String(currentRowIdValues.toString()));
        return currentRow;
      }

      if (!!currentRow.children?.length) {
        if (findParent(complexRowId, currentRow.children)) {
          resArr.push(String(currentRowIdValues.toString()));
          return currentRow;
        }
      }
    }
  }

  findParent(checkingComplexRowId, data)

  return resArr;
}
