import type { Ref } from "vue";
import { ref, toValue } from "vue";

import type { INewTableRow } from "../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";
import type {
  INewTableCellActionData,
  INewTableChangeCellValueEvent,
  INewTableRowActionEvent
} from "../../../components/NewTable/types/NewTableEventTypes";

import { findParentRowsById, findParentRowWithChildIndexByChildRowId, findRowById } from "../../../helpers/finders";
import type { ILocalNewTableRow } from "../testdata/testData";
import { TEST_DATA_ROW_TYPES } from "../testdata/testData";
import { calcOwnSums, calcParentSums, calcTotalOwnSums } from "../../../helpers/calacSums";
import { columnsToCalc, totalColumnsToCalc } from "../testdata/testColumns";
import { NEW_TABLE_STANDART_CELL_ACTIONS, NEW_TABLE_STANDART_ROW_ACTIONS } from "../../../components/NewTableWrapper/constants/standartActions";
import { NEW_TABLE_STANDART_ROW_MODES } from "../../../components/NewTable/constants/standartRowModes";

import type NewReestr from "../../../components/NewReestr/NewReestr.vue";

export function useTestPage1NewReestrActions(
  initialData: Ref<INewTableRow[]> | INewTableRow[] | (() => INewTableRow[]),
  newReestrRef: Ref<typeof NewReestr> | typeof NewReestr | (() => typeof NewReestr)
) {
  const selectedRow = ref<INewTableRow | null>(null);

  /**
   * МЕНЯЕТ ДАННЫЕ
   * @param row строка, которую нужно обновить в данных
   */
  function setRow(row: INewTableRow) {
    const parenRows = findParentRowsById(row.data.id, toValue(initialData));

    if (!parenRows) {
      return;
    }

    parenRows?.forEach((r, index) => {
      if (r.data.id === row.data.id) {
        parenRows[index] = row;
      }
    });
  }

  function saveRow(row: INewTableRow) {
    setRow(row);
  }

  function deleteRow(row: INewTableRow) {
    const confirmRes = confirm('Are you sure&');

    if (!confirmRes) {
      return;
    }

    const parentRowWithChildRowId = findParentRowWithChildIndexByChildRowId(
      row.data.id,
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

  function onSave(event: INewTableRowActionEvent) {
    calcTotalOwnSums(event.row as ILocalNewTableRow);
    saveRow(event.row);
    calcParentSums(event.row, toValue(initialData), columnsToCalc);
    toValue(newReestrRef).deleteChangedRow(event.row.data.id);
  }

  function onDelete(event: INewTableRowActionEvent) {
    const parentRow = findParentRowWithChildIndexByChildRowId(event.row.data.id, toValue(initialData));
    deleteRow(event.row);
    if (parentRow) {
      calcOwnSums(parentRow.parent, toValue(initialData), columnsToCalc);
      calcParentSums(parentRow.parent, toValue(initialData), columnsToCalc);
    }
    toValue(newReestrRef).deleteChangedRow(event.row.data.id);
  }

  function onCancel(event: INewTableRowActionEvent) {
    toValue(newReestrRef).deleteChangedRow(event.row.data.id);
  }

  function onRowAction(event: INewTableRowActionEvent) {
    switch (event.name) {
      case NEW_TABLE_STANDART_ROW_ACTIONS.SAVE:
        onSave(event);
        break;
      case NEW_TABLE_STANDART_ROW_ACTIONS.DELETE:
        onDelete(event);
        break;
      case NEW_TABLE_STANDART_ROW_ACTIONS.CANCEL:
        onCancel(event);
        break;
      case NEW_TABLE_STANDART_ROW_ACTIONS.CELL_ACTION:
        onCellAction(event);
        break;
      case 'click':
        selectedRow.value = event.row;
        break;
      case 'keyup':
        onKeyup(event);
        break;
    }
  }

  function onKeyup(event: INewTableRowActionEvent) {
    const key = event.event instanceof KeyboardEvent ? event.event.key : null;
    if (key === 'Enter') {
      onSave(event);
      toValue(newReestrRef).switchOffModeForRow(NEW_TABLE_STANDART_ROW_MODES.EDIT, event.row);
    }
    if (key === 'Escape') {
      onCancel(event);
      toValue(newReestrRef).switchOffModeForRow(NEW_TABLE_STANDART_ROW_MODES.EDIT, event.row);
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
    selectedRow,
    setRow,
    onCellAction,
    onChangeCellValue,
    onDelete,
    deleteRow,
    onRowAction,
    onSave,
    saveRow,
  };
}