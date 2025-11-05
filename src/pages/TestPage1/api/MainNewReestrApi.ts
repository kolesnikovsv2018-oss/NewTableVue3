import type { INewMenuItem } from "../../../components/NewContextMenu/types";
import type { IUseNewReestrApi } from "./NewReestrApi";

import { useNewReestrApi } from "./NewReestrApi";

import { testSideMenuItems } from "../testdata/testMainSideMenuItems";

export interface IUseMainNewReestrApi extends IUseNewReestrApi {
  fetchSideMenuItems: () => Promise<INewMenuItem[]>;
};

export function useMainNewReestrApi(): IUseMainNewReestrApi {
  const newReestrApi = useNewReestrApi();


  function fetchSideMenuItems(): Promise<INewMenuItem[]> {
    return new Promise((resolve) => {
      resolve(testSideMenuItems);
    });
  }

  return {
    fetchSideMenuItems,
    ...newReestrApi,
  };
};
