import { NEW_TABLE_STANDART_ROW_MODES } from "../../../components/NewTable/constants/standartRowModes";
import { TNewTableActionsChangeModesStandart } from "../../../components/NewTable/types/NewTableActionsChangeModesTypes";
import { NEW_TABLE_STANDART_ROW_ACTIONS } from "../../../components/NewTableWrapper/constants/standartActions";
import { TEST_DATA_ROW_TYPES } from "./testData";

export const testActionsChangeModes: TNewTableActionsChangeModesStandart = {
  [TEST_DATA_ROW_TYPES.TASK]: {
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
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CHECK_ON]: {
      on: [NEW_TABLE_STANDART_ROW_MODES.CHECKED],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CHECK_OFF]: {
      off: [NEW_TABLE_STANDART_ROW_MODES.CHECKED],
    },
  },
};