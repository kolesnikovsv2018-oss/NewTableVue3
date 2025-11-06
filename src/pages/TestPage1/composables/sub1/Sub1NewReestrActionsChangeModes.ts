import type { Ref } from "vue";
import { ref } from "vue";

import type { TNewTableActionsChangeModesStandart } from "../../../../components/NewTable/types/NewTableActionsChangeModesTypes";

import { NEW_TABLE_DEFAULT_ROW_TYPE } from "../../../../components/NewTable/constants/defaults";
import { NEW_TABLE_STANDART_ROW_ACTIONS } from "../../../../components/NewTableWrapper/constants/standartActions";

import { newTableStandartActionsChangeModes } from "../../../../components/NewTableWrapper/constants/standartActionsChangeModes";
import { useSub1NewReestrApi } from "../../api/Sub1NewReestrApi";

export interface IUseSub1NewReestrActionsChangeModes {
  actionsChangeModes: Ref<TNewTableActionsChangeModesStandart>;
  initActionsChangeModes: () => Promise<void>;
}

/**
 * Композиция для получения действий с изменением режимов
 * @returns {IUseSub1NewReestrActionsChangeModes} Действия для изменения режимов
 */
export function useSub1NewReestrActionsChangeModes(): IUseSub1NewReestrActionsChangeModes {
  const actionsChangeModes = ref<TNewTableActionsChangeModesStandart>({});

  const sub1NewReestrApiComposable = useSub1NewReestrApi();

  async function initActionsChangeModes() {
    const localActionsChangeModes = {
      ...newTableStandartActionsChangeModes,
      ...(await sub1NewReestrApiComposable.fetchActionsChangeModes()),
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
