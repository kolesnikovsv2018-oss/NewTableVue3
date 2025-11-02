import type { INewMenuItem } from "../../NewContextMenu/types";
import type { INewTableRowNativeEvent } from "../../NewTable/types/NewTableEventTypes";

export function useNewReestrContextMenu(
  // activeContextMenuItems: Ref<INewContexMenuItem[]> | INewContexMenuItem[] | (() => INewContexMenuItem[]),
) {
  function generateContextMenuItemsWithPayload(
    activeContextMenuItems: INewMenuItem[],
    event: INewTableRowNativeEvent,
  ): INewMenuItem[] {
    return activeContextMenuItems
      .filter(
        (activeContextMenuItem: INewMenuItem) => {
          if (
            !activeContextMenuItem.modes?.length
            || !event.modes?.length
          ) {
            return true;
          }

          return activeContextMenuItem.modes.some(
            (activeContextMenuItemMode: string) => event.modes.includes(activeContextMenuItemMode),
          )
        },
      )
      .map(
        (activeContextMenuItem: INewMenuItem) => {
          const newActiveContextMenuItems = {
            ...activeContextMenuItem,
            payload: event,
          };

          if (!!newActiveContextMenuItems.children?.length) {
            newActiveContextMenuItems.children =
              generateContextMenuItemsWithPayload(newActiveContextMenuItems.children, event);
          }

          return newActiveContextMenuItems;
        },
      );
  }

  return {
    generateContextMenuItemsWithPayload,
  };
}