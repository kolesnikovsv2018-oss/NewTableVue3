import type { Ref } from "vue";
import { toValue } from "vue";

import type { IUseSub1NewReestrOnRowActions } from "./Sub1NewReestrOnRowActions";
import type { INewMenuItem } from "../../../../components/NewContextMenu/types";
import type { INewTableRowActionEvent } from "../../../../components/NewTable/types/NewTableEventTypes";
import type NewReestr from "../../../../components/NewReestr/NewReestr.vue";

import { NEW_TABLE_STANDART_ROW_MODES } from "../../../../components/NewTable/constants/standartRowModes";

export interface IUseSub1NewReestrContextMenu {
  onSelectContextMenuItem: (menuItem: INewMenuItem) => void;
};

export function useSub1NewReestrContextMenu(
  newSub1ReestrRef: Ref<typeof NewReestr> | typeof NewReestr | (() => typeof NewReestr),
  sub1NewReestrOnRowActionsComposable: IUseSub1NewReestrOnRowActions,
): IUseSub1NewReestrContextMenu {
  function onSelectContextMenuItem(menuItem: INewMenuItem) {
    const payload: INewTableRowActionEvent = menuItem.payload;

    switch (menuItem.actionName) {
      case 'edit-row':
        toValue(newSub1ReestrRef).switchOnModeForRow(NEW_TABLE_STANDART_ROW_MODES.EDIT, payload.row);
        break;
      case 'save-row':
        sub1NewReestrOnRowActionsComposable.onSave({ name: 'save', row: payload.row });
        break;
      case 'delete-row':
        sub1NewReestrOnRowActionsComposable.onDelete({ name: 'delete', row: payload.row });
        break;
      case 'cell-info':
        const strData = payload.row.data[payload.header.key] as string;
        alert(`${payload.row.data.id} - ${payload.header.key} => ${String(strData)}`)
        break;
      case 'change-row-parent':
        sub1NewReestrOnRowActionsComposable.activeRowForChangeParent.value = payload.row;
        break;
    }
  }

  return {
    onSelectContextMenuItem,
  };
};
