import type { TNewTableActionsChangeModesStandart } from "@/components/NewTable/types/NewTableActionsChangeModesTypes";

import { NEW_TABLE_STANDART_ROW_MODES } from "@/components/NewTable/constants/standartRowModes";
import { NEW_TABLE_STANDART_ROW_ACTIONS } from "@/components/NewTableWrapper/constants/standartActions";
import { NEW_TABLE_DEFAULT_ROW_TYPE } from "@/components/NewTable/constants/defaults";


/**
 * @constant {TTActionsChangeModesStandart} standartActionsChangeModes для каждого типа строк указаны дкйствия,
 * которые включают или отключают несколько режимов
 */
export const newTableStandartActionsChangeModes: TNewTableActionsChangeModesStandart = {
  [NEW_TABLE_DEFAULT_ROW_TYPE]: {
    [NEW_TABLE_STANDART_ROW_ACTIONS.EDIT]: {
      on: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
      off: [],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CANCEL]: {
      on: [],
      off: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]: {
      on: [],
      off: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.DELETE]: {
      on: [],
      off: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
      withChildren: true,
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CHECK_ON]: {
      on: [NEW_TABLE_STANDART_ROW_MODES.CHECKED],
      withChildren: true,
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CHECK_OFF]: {
      off: [NEW_TABLE_STANDART_ROW_MODES.CHECKED],
      withChildren: true,
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.EXPAND_ON]: {
      on: [NEW_TABLE_STANDART_ROW_MODES.EXPANDED],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.EXPAND_OFF]: {
      off: [NEW_TABLE_STANDART_ROW_MODES.EXPANDED],
      withChildren: true,
    },
  }
};
