import type { INewTableRow } from "../components/NewTable/components/NewTableRow/types/NewTableRowTypes";
import { totalColumnsToCalc } from "../pages/TestPage1/testdata/testColumns";
import { ILocalNewTableRow } from "../pages/TestPage1/testdata/testData";
import type { TFindParentRowWithChildIndexByChildRowId } from "./finders";

import { findParentRowWithChildIndexByChildRowId } from "./finders";

export function calcTotalOwnSums(row: ILocalNewTableRow) {
  Object.keys(totalColumnsToCalc).forEach(
    (columnName: string) => {
      row.data[columnName] = totalColumnsToCalc[columnName].reduce(
        (acc: number, columnToAdd: string) => acc + (row.data[columnToAdd] as number),
        0
      );
    }
  );
}

export function calcOwnSums(row: INewTableRow, data: INewTableRow[], columnsToCalc: string[]) {
  calcTotalOwnSums(row as ILocalNewTableRow);

  columnsToCalc.forEach(
    (columnName: string) => {
      row.data[columnName] = row.children.reduce(
        (acc: number, childRow: INewTableRow): number => acc = acc + Number(childRow.data[columnName] || 0),
        0,
      );
    }
  )
}

/**
 * Calculate the sums of the children for a given parent row
 * @param {INewTableRow} row - The parent row for which to calculate the sums
 * @param {INewTableRow[]} data - The array of rows to search for the parent
 * @param {string[]} columnsToCalc - The columns for which to calculate the sums
 */
export function calcParentSums(
  row: INewTableRow,
  data: INewTableRow[],
  columnsToCalc: string[]
): void {
  let currentParent: TFindParentRowWithChildIndexByChildRowId | null = null;

  let newParentRowWithIndexOfParent: TFindParentRowWithChildIndexByChildRowId
    = findParentRowWithChildIndexByChildRowId(row.data.id, data);

  while (currentParent !== newParentRowWithIndexOfParent && !!newParentRowWithIndexOfParent) {
    calcOwnSums(newParentRowWithIndexOfParent.parent, data, columnsToCalc);
    currentParent = newParentRowWithIndexOfParent;
    newParentRowWithIndexOfParent = findParentRowWithChildIndexByChildRowId(currentParent.parent.data.id, data);
  }
}
