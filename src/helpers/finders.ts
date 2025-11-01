import type { INewTableRow } from "../components/NewTable/components/NewTableRow/types/NewTableRowTypes";

export type TFindParentRowWithChildIndexByChildRowId = { parent: INewTableRow, index: number };

export function findRowById(
  rowId: number | string,
  rows: INewTableRow[],
): INewTableRow | undefined {
  const findedRow = rows.find(r => String(r.data.id) === String(rowId));
  if (!findedRow) {
    for (const row of rows) {
      if (row.children?.length) {
        const childRow = findRowById(rowId, row.children);
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
 * @param rowId искомый rowId
 * @param rows все данные, которых нужно провести поиск
 * @returns 
 */
export function findParentRowsById(
  rowId: number | string,
  rows: INewTableRow[],
): INewTableRow[] | undefined {
  const findedRow = rows.find(r => String(r.data.id) === String(rowId));
  if (!findedRow) {
    for (const row of rows) {
      if (row.children?.length) {
        const childRows = findParentRowsById(rowId, row.children);
        if (childRows) {
          return childRows;
        }
      }
    }
  } else {
    return rows;
  }
}

export function findParentRowWithChildIndexByChildRowId(
  childRowId: number | string,
  rows: INewTableRow[],
): TFindParentRowWithChildIndexByChildRowId | undefined {
  for (const row of rows) {
    if (!row.children?.length) {
      continue;
    }

    const childIndex: number = row.children.findIndex(
      (r: INewTableRow): boolean => String(r.data.id) === String(childRowId),
    );

    if (childIndex !== -1) {
      return {
        parent: row,
        index: childIndex
      };
    }

    const parentRowWithChildIndex = findParentRowWithChildIndexByChildRowId(childRowId, row.children);
    if (parentRowWithChildIndex) {
      return parentRowWithChildIndex;
    }
  }
}

export function findAllParentRowsFor(
  checkingRowId: number | string,
  data: INewTableRow[],
): string[] {
  const resArr: string[] = [];

  const findParent = (rowId: number | string, currentData: INewTableRow[]) => {
    for (const currentRow of currentData) {
      if (currentRow.children?.find(
        (currentChildRow: INewTableRow) => String(currentChildRow.data.id) === String(rowId)
      )) {
        resArr.push(String(currentRow.data.id));
        return currentRow;
      }

      if (!!currentRow.children?.length) {
        if (findParent(rowId, currentRow.children)) {
          resArr.push(String(currentRow.data.id));
          return currentRow;
        }
      }
    }
  }

  findParent(checkingRowId, data)

  return resArr;
}
