import type { Ref } from "vue";
import { ref, toValue } from "vue";

export interface IUseNewReestr {
  rowCount: Ref<number>;
  reestrName: string;
  loadReestrSettingsFromLocalStorage: () => void;
  saveReestrSettingsToLocalStorage: () => void;
  onChangeRowCount: (newRowCount: number) => void;
};

export function useNewReestr(
  reestrName: Ref<string> | string | (() => string),
  initialRowCount: (number | Ref<number> | (() => number)) = 10,
): IUseNewReestr {
  const rowCount = ref<number>(toValue(initialRowCount));

  function saveReestrSettingsToLocalStorage() {
    const reestrSettings = {
      rowCount: rowCount.value,
    };

    localStorage.setItem(`${toValue(reestrName)}_settings`, JSON.stringify(reestrSettings));
  }

  function loadReestrSettingsFromLocalStorage() {
    const reestrSettingsJSON = localStorage.getItem(`${toValue(reestrName)}_settings`);

    if (reestrSettingsJSON) {
      const reestrSettings = JSON.parse(reestrSettingsJSON);
      rowCount.value = reestrSettings.rowCount;
    }
  }

  function onChangeRowCount(
    newRowCount: number,
  ) {
    rowCount.value = newRowCount;
    saveReestrSettingsToLocalStorage();
  }

  return {
    rowCount,
    reestrName: toValue(reestrName),
    loadReestrSettingsFromLocalStorage,
    saveReestrSettingsToLocalStorage,
    onChangeRowCount,
  };
}