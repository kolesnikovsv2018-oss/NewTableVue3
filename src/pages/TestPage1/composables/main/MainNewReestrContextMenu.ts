import type { Ref } from "vue";
import { toValue } from "vue";

import type { IUseMainNewReestrOnRowActions } from "./MainNewReestrOnRowActions";
import type { INewMenuItem } from "../../../../components/NewContextMenu/types";
import type { INewTableRowActionEvent } from "../../../../components/NewTable/types/NewTableEventTypes";
import type NewReestr from "../../../../components/NewReestr/NewReestr.vue";

import { NEW_TABLE_STANDART_ROW_MODES } from "../../../../components/NewTable/constants/standartRowModes";

export interface IUseMainNewReestrContextMenu {
  onSelectContextMenuItem: (menuItem: INewMenuItem) => void;
};

export function useMainNewReestrContextMenu(
  newMainReestrRef: Ref<typeof NewReestr> | typeof NewReestr | (() => typeof NewReestr),
  mainNewReestrOnRowActionsComposable: IUseMainNewReestrOnRowActions,
): IUseMainNewReestrContextMenu {
  function onSelectContextMenuItem(menuItem: INewMenuItem) {
    const payload: INewTableRowActionEvent = menuItem.payload;

    switch (menuItem.actionName) {
      case 'edit-row':
        toValue(newMainReestrRef).switchOnModeForRow(NEW_TABLE_STANDART_ROW_MODES.EDIT, payload.row);
        break;
      case 'save-row':
        mainNewReestrOnRowActionsComposable.onSave({ name: 'save', row: payload.row });
        break;
      case 'delete-row':
        mainNewReestrOnRowActionsComposable.onDelete({ name: 'delete', row: payload.row });
        break;
      case 'cell-info':
        const strData = payload.row.data[payload.header.key] as string;
        alert(`${payload.row.data.id} - ${payload.header.key} => ${String(strData)}`)
        break;
      case 'change-row-parent':
        mainNewReestrOnRowActionsComposable.activeRowForChangeParent.value = payload.row;
        break;
    }
  }

  return {
    onSelectContextMenuItem,
  };
};
