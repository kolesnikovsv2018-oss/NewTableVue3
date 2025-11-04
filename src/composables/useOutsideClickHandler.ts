import type { Ref } from "vue";
import { computed, onBeforeUnmount, onMounted, toValue } from "vue";

export function useOutsideClickHandler(
  elRef: Ref<HTMLElement> | HTMLElement | (() => HTMLElement),
  onCloseCallback: (event: MouseEvent) => void
) {
  const el = computed<HTMLElement>(
    () => toValue(elRef),
  );

  onMounted(() => {
    // el?.value.addEventListener('click', clickHandler, true);
    window.addEventListener('click', outsideClickHandler, true);
  });

  onBeforeUnmount(() => {
    // el?.value.removeEventListener('click', clickHandler, true);
    window.removeEventListener('click', outsideClickHandler, true);
  });

  function outsideClickHandler(event: MouseEvent) {
    if (
      event.type === 'click'
      && event.button === 0
      && !el.value?.contains(event.target as HTMLElement)
    ) {
      event.stopPropagation();
      event.preventDefault();

      onCloseCallback(event);
    }
  }
}