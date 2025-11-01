import { computed, onBeforeUnmount, onMounted, Ref, toValue } from "vue";

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
    // event.stopPropagation();
    // event.preventDefault();

    if (
      event.type === 'click'
      && !el?.value.contains(event.target as HTMLElement)
    ) {
      onCloseCallback(event);
    }
  }
}