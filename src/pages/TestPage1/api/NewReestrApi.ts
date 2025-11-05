import type { INewTableColumns, INewTableColumnSettings } from "../../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";
import type { INewTableRow } from "../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";
import type { INewTableActions } from "../../../components/NewTable/types/NewTableActionTypes";

import { generateLargeTestData } from "../testdata/testNewReestrData";
import { newTableStandartActions } from "../../../components/NewTableWrapper/constants/standartActions";

export interface IUseNewReestrApi {
  fetchActions: () => Promise<INewTableActions>;
  fetchData: (payload: { columns: INewTableColumns, count?: number, maxLevel?: number }) => Promise<INewTableRow[]>;
};

export function useNewReestrApi(): IUseNewReestrApi {
  function fetchActions(): Promise<INewTableActions> {
    return new Promise((resolve) => {
      resolve(newTableStandartActions);
    });
  }

  function fetchData(
    payload: { columns: INewTableColumns, count?: number, maxLevel: number },
  ): Promise<INewTableRow[]> {
    return new Promise((resolve) => {
      const { columns, count, maxLevel } = payload;

      const data = generateLargeTestData(columns, count, maxLevel);
      resolve(data);
    });
  }

  return {
    fetchActions,
    fetchData,
  };
};
