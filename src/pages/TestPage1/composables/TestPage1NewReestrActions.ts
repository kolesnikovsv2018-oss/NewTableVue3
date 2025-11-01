import { Ref, toValue } from "vue";

import type { INewTableRow } from "../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";
import type { INewTableCellActionData, INewTableChangeCellValueEvent, INewTableRowActionEvent } from "../../../components/NewTable/types/NewTableEventTypes";

import { findParentRowsById, findParentRowWithChildIndexByChildRowId, findRowById } from "../../../helpers/finders";
import { ILocalNewTableRow, TEST_DATA_ROW_TYPES } from "../testdata/testData";
import { calcOwnSums, calcParentSums, calcTotalOwnSums } from "../../../helpers/calacSums";
import { columnsToCalc, totalColumnsToCalc } from "../testdata/testColumns";
import { NEW_TABLE_STANDART_CELL_ACTIONS, NEW_TABLE_STANDART_ROW_ACTIONS } from "../../../components/NewTableWrapper/constants/standartActions";

import NewReestr from "../../../components/NewReestr/NewReestr.vue";

export function useTestPage1NewReestrActions(
  initialData: Ref<INewTableRow[]> | INewTableRow[] | (() => INewTableRow[]),
  setRow: (row: INewTableRow) => void,
  newReestrRef: Ref<typeof NewReestr> | typeof NewReestr | (() => typeof NewReestr)
) {
  function onSave(row: INewTableRow) {
    setRow(row);
  }

  function onDelete(event: INewTableRowActionEvent) {
    const confirmRes = confirm('Are you sure&');

    if (!confirmRes) {
      return;
    }

    const row: INewTableRow = event.row;

    const parentRowWithChildRowId = findParentRowWithChildIndexByChildRowId(
      event.row.data.id,
      toValue(initialData)
    );

    const parenRows = findParentRowsById(row.data.id, toValue(initialData));
    parenRows?.splice(
      parenRows.findIndex(r => r.data.id === row.data.id),
      1
    );

    if (!row.children) {
      row.meta.rowType = TEST_DATA_ROW_TYPES.TASK;
    }

    if (parentRowWithChildRowId) {
      calcOwnSums(parentRowWithChildRowId.parent, toValue(initialData), columnsToCalc);
      calcParentSums(parentRowWithChildRowId.parent, toValue(initialData), columnsToCalc);
    }
  }

  function onRowAction(event: INewTableRowActionEvent) {
    switch (event.name) {
      case NEW_TABLE_STANDART_ROW_ACTIONS.SAVE:
        calcTotalOwnSums(event.row as ILocalNewTableRow);
        onSave(event.row);
        calcParentSums(event.row, toValue(initialData), columnsToCalc);
        toValue(newReestrRef).deleteChangedRow(event.row.data.id);
        break;
      case NEW_TABLE_STANDART_ROW_ACTIONS.DELETE:
        const parentRow = findParentRowWithChildIndexByChildRowId(event.row.data.id, toValue(initialData));
        onDelete(event);
        if (parentRow) {
          calcOwnSums(parentRow.parent, toValue(initialData), columnsToCalc);
          calcParentSums(parentRow.parent, toValue(initialData), columnsToCalc);
        }
        toValue(newReestrRef).deleteChangedRow(event.row.data.id);
        break;
      case NEW_TABLE_STANDART_ROW_ACTIONS.CANCEL:
        toValue(newReestrRef).deleteChangedRow(event.row.data.id);
        break;
      case NEW_TABLE_STANDART_ROW_ACTIONS.CELL_ACTION:
        onCellAction(event);
        break;
      default:
        console.warn('Unknown action:', event.name, 'for row:', event.row);
    }
  }

  function onCellAction(event: INewTableRowActionEvent) {
    const cellActionValue: INewTableCellActionData = event.value as INewTableCellActionData;

    switch (cellActionValue.name) {
      case NEW_TABLE_STANDART_CELL_ACTIONS.CHANGE_CELL:
        onChangeCellValue({
          row: event.row, // row
          key: cellActionValue?.key, // cell name
          value: cellActionValue?.value, // event data from cell component        
        });
        break;
    }
  }

  function onChangeCellValue(event: INewTableChangeCellValueEvent) {
    const row = findRowById(event.row.data.id, toValue(initialData));
    if (row) {
      // row.data[event.key] = event.value;
      event.row[event.key] = event.value;

      if (Object.keys(totalColumnsToCalc).some(
        (totalColumnName: string) => totalColumnsToCalc[totalColumnName].includes(event.key),
      )) {
        calcTotalOwnSums(event.row as ILocalNewTableRow);
      }
    }
  }

  return {
    onCellAction,
    onChangeCellValue,
    onDelete,
    onRowAction,
    onSave,
  };
}