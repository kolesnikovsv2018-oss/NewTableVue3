import type { Ref } from "vue";
import { ref, toValue } from "vue";

export function useTestPage1Settings(
  pageName: Ref<string> | string | (() => string),
) {
  const splitterDiv1Height = ref<number | null>(null);

  function savePageSettingsToLocalStorage() {
    const settings = {
      splitterDiv1Height: splitterDiv1Height.value,
    };
    localStorage.setItem(
      toValue(pageName),
      JSON.stringify(settings)
    );
  }

  function loadPageSettingsFromLocalStorage() {
    const item = localStorage.getItem(
      toValue(pageName)
    );
    if (item) {
      const settings = JSON.parse(item);
      splitterDiv1Height.value = settings.splitterDiv1Height;
    }
  }

  return {
    splitterDiv1Height,
    savePageSettingsToLocalStorage,
    loadPageSettingsFromLocalStorage,
  };
}
