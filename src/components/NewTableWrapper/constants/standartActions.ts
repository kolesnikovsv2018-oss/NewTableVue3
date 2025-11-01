
import type { INewTableActions } from '../../NewTable/types/NewTableActionTypes';

import {
  NEW_TABLE_STANDART_ROW_MODES
} from '../../NewTable/constants/standartRowModes';
import {
  faPenToSquare,
  faFloppyDisk,
  faXmark,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { NEW_TABLE_DEFAULT_ROW_TYPE } from '../../NewTable/constants/defaultRowType';

export const NEW_TABLE_STANDART_ROW_ACTIONS: Record<string, string> = {
  EDIT: 'edit',
  CANCEL: 'cancel',
  SAVE: 'save',
  DELETE: 'delete',
  CHECK_ON: 'check-on',
  CHECK_OFF: 'check-off',
  EXPAND_ON: 'expand-on',
  EXPAND_OFF: 'expand-off',
  CELL_ACTION: 'cell-action', // -> NEW_TABLE_STANDART_CELL_ACTIONS
};

export const NEW_TABLE_STANDART_CELL_ACTIONS: Record<string, string> = {
  CHANGE_CELL: 'change:cell'
};

// дкйствия, доступные для типа строк при включенных режимах
export const newTableStandartActions: INewTableActions = {
  [NEW_TABLE_DEFAULT_ROW_TYPE]: {
    [NEW_TABLE_STANDART_ROW_ACTIONS.EDIT]: {
      actionName: NEW_TABLE_STANDART_ROW_ACTIONS.EDIT,
      icon: faPenToSquare,
      modes: [NEW_TABLE_STANDART_ROW_MODES.VIEW],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]: {
      actionName: NEW_TABLE_STANDART_ROW_ACTIONS.SAVE,
      icon: faFloppyDisk,
      modes: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CANCEL]: {
      actionName: NEW_TABLE_STANDART_ROW_ACTIONS.CANCEL,
      icon: faXmark,
      modes: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.DELETE]: {
      actionName: NEW_TABLE_STANDART_ROW_ACTIONS.DELETE,
      icon: faTrash,
    },
  },
};