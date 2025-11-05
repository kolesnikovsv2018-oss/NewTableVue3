import type { Ref } from "vue";
import { ref } from "vue";

import type { INewMenuItem } from "../../../../components/NewContextMenu/types";
import type { IUseNewReestrFilters } from "../NewReestrFilters";

interface IMainNewReestrSideMenuSubmitEvent {
  name: string;
  value?: unknown;
  payload?: unknown;
};

export interface IUseMainNewReestrSideMenu {
  sideMenuComponentSettings: Ref<Record<string, { isShown: boolean, payload: unknown }>>;
  onSelectSideMenuItem: (menuItem: INewMenuItem) => void;
  onNewReestrSideMenuDateFilterSubmit: (event: IMainNewReestrSideMenuSubmitEvent) => void;
  onNewReestrSideMenuSummsSubmit: (event: IMainNewReestrSideMenuSubmitEvent) => void;
};

export function useMainNewReestrSideMenu(
  mainReestr: IUseNewReestrFilters,
): IUseMainNewReestrSideMenu {
  const sideMenuComponentSettings = ref<Record<string, { isShown: boolean, payload: unknown }>>({});

  function onSelectSideMenuItem(menuItem: INewMenuItem) {
    switch (menuItem.actionName) {
      case 'date-filter':
      case 'summs':
        sideMenuComponentSettings.value = {
          ...sideMenuComponentSettings.value,
          [menuItem.actionName]: {
            isShown: true,
            payload: menuItem.payload,
          },
        };
    }
  }

  function onNewReestrSideMenuDateFilterSubmit(
    { name, value }: IMainNewReestrSideMenuSubmitEvent,
  ) {
    mainReestr.setFilter({ name: 'date', value: { date1: value, date2: value } });

    sideMenuComponentSettings.value[name].isShown = false
  }

  function onNewReestrSideMenuSummsSubmit(
    { name }: IMainNewReestrSideMenuSubmitEvent,
  ) {
    sideMenuComponentSettings.value[name].isShown = false
  }

  return {
    sideMenuComponentSettings,
    onSelectSideMenuItem,
    onNewReestrSideMenuDateFilterSubmit,
    onNewReestrSideMenuSummsSubmit,
  };
}