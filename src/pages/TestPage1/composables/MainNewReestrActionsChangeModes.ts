import type { Ref } from "vue";
import { ref } from "vue";

import type { TNewTableActionsChangeModesStandart } from "../../../components/NewTable/types/NewTableActionsChangeModesTypes";

import { NEW_TABLE_DEFAULT_ROW_TYPE } from "../../../components/NewTable/constants/defaultRowType";
import { NEW_TABLE_STANDART_ROW_ACTIONS } from "../../../components/NewTableWrapper/constants/standartActions";

import { newTableStandartActionsChangeModes } from "../../../components/NewTableWrapper/constants/standartActionsChangeModes";
import { useMainNewReestrApi } from "../api/MainNewReestrApi";

export interface IUseMainNewReestrActionsChangeModes {
  actionsChangeModes: Ref<TNewTableActionsChangeModesStandart>;
  initActionsChangeModes: () => Promise<void>;
}

/**
 * Композиция для получения действий с изменением режимов
 * @returns {IUseMainNewReestrActionsChangeModes} Действия для изменения режимов
 */
export function useMainNewReestrActionsChangeModes(): IUseMainNewReestrActionsChangeModes {
  const actionsChangeModes = ref<TNewTableActionsChangeModesStandart>({});

  const mainNewReestrApiComposable = useMainNewReestrApi();

  async function initActionsChangeModes() {
    const localActionsChangeModes = {
      ...newTableStandartActionsChangeModes,
      ...(await mainNewReestrApiComposable.fetchActionsChangeModes()),
    };

    actionsChangeModes.value = {
      ...localActionsChangeModes,
      [NEW_TABLE_DEFAULT_ROW_TYPE]: {
        ...(localActionsChangeModes[NEW_TABLE_DEFAULT_ROW_TYPE] || {}),
        [NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]: {
          on: [...(localActionsChangeModes[NEW_TABLE_DEFAULT_ROW_TYPE]?.[NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]?.on || []), 'changed'],
          off: localActionsChangeModes[NEW_TABLE_DEFAULT_ROW_TYPE]?.[NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]?.off || [],
        }
      },
    };
  }

  return {
    actionsChangeModes,
    initActionsChangeModes,
  };
};
