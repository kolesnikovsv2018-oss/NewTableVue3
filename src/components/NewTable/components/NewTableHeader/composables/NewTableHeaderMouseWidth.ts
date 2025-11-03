import type { Ref } from "vue";
import { toValue } from "vue";

import type { INewTableChangeColumnWidthEvent } from "../../../types/NewTableEventTypes";
import type { INewTableColumnSetting } from "../types/INewTableHeadTypes";

type TNewTableHeaderMouseWidthEmit = (e: 'change:column-width', event: INewTableChangeColumnWidthEvent) => void;

export function useNewTableHeaderMouseWidth(
  localColumnsSettings: Ref<Record<string, INewTableColumnSetting>> | Record<string, INewTableColumnSetting> | (() => Record<string, INewTableColumnSetting>),
  emit: TNewTableHeaderMouseWidthEmit,
) {
  function onMouseDown(columnName: string, event: MouseEvent) {
    if (
      event.button !== 0
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const onMouseMoveLocal = (mouseEvent: MouseEvent) => onMouseMove(columnName, mouseEvent);
    const onMouseUpLocal = () => {
      event.preventDefault();
      event.stopPropagation();
      document.removeEventListener('mousemove', onMouseMoveLocal);
      document.removeEventListener('mouseup', onMouseUpLocal);
    }

    document.addEventListener('mousemove', onMouseMoveLocal);
    document.addEventListener('mouseup', onMouseUpLocal);
  }

  function onMouseMove(columnName: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    let currentWidth = toValue(localColumnsSettings)[columnName].width;

    if (!currentWidth) {
      currentWidth = (event.target as HTMLElement)?.getBoundingClientRect().width
    }

    emit('change:column-width', { columnName, delta: event.movementX, currentWidth });
  }

  return {
    onMouseDown,
    onMouseMove,
  }
}