import type { INewTableRow, INewTableRowTemplate } from "../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";
import type { INewTableColumns } from "../../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";
import { columnsToCalc, totalColumnsToCalc } from "./constants/calcs";

type TTestDataType = string | number | [] | object | null | undefined;

export interface ILocalNewTableRowData extends Record<string, TTestDataType> {
  id: number | string;
  name: string;
  status: string;
  pricePIR?: number;
  pricePNR?: number;
  priceSMR?: number;
  priceTotal?: number;
  customPricePIR?: number;
  customPricePNR?: number;
  customPriceSMR?: number;
  customPriceTotal?: number;
}

export type ILocalNewTableRow = INewTableRowTemplate<ILocalNewTableRowData>

export const TEST_DATA_ROW_TYPES: Record<string, string> = {
  STAGE: 'stage',
  SUB_STAGE: 'subStage',
  TASK: 'task',
};

export const generateLargeTestData = (
  columns: INewTableColumns,
  count: number = 10000,
  maxLevel: number = 4,
): ILocalNewTableRow[] => {
  const result: ILocalNewTableRow[] = [];
  let currentId = 0;

  const availableStatuses = ['active', 'completed', 'in-progress', 'not-started'];

  // Only calculate sums for columns that actually exist in provided headers
  const calcColumns = columnsToCalc.filter((key) => key in columns);
  const extraFieldKeys = Object.keys(columns).filter((k) => /^extraField\d+$/.test(k));


  const summAllChildrenForField = (node: ILocalNewTableRow, fieldName: string): ILocalNewTableRow => {
    if (node.children?.length) {
      node.data[fieldName] = node.children.reduce(
        (acc: number, curr: INewTableRow) => (fieldName in curr.data) ? (acc + Number(curr.data[fieldName])) : acc,
        0,
      );
    }

    return node;
  }

  const summAllChildrenForFields = (node: ILocalNewTableRow, fieldNames: string[]) => {
    let resNode = node;
    fieldNames.forEach(
      (fieldName: string) => {
        resNode = summAllChildrenForField(resNode, fieldName);
      }
    );

    return resNode;
  }

  const createNode = (level: number = 0): ILocalNewTableRow => {
    currentId++;
    const hasChildren = level === 0 || (level < maxLevel && Math.random() > 0.3);
    const rowType = level === 0
      ? TEST_DATA_ROW_TYPES.STAGE
      : hasChildren ? TEST_DATA_ROW_TYPES.SUB_STAGE : TEST_DATA_ROW_TYPES.TASK;

    const node: ILocalNewTableRow = {
      meta: { rowType },
      data: {
        // Always provide id and name for row identity
        id: currentId,
        name: `${rowType} ${currentId}`,
        // status is required by ILocalNewTableRowData
        status: availableStatuses[Math.floor(Math.random() * availableStatuses.length)],
        ...(('date' in columns) ? { date: new Date(Date.now() + (30 - Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString().replace(/T.*/, '') } : {}),
      },
    };

    if (!hasChildren) {
      // Base price fields (only if present in headers)
      if ('pricePIR' in columns) node.data.pricePIR = Math.round(Math.random() * 1000);
      if ('pricePNR' in columns) node.data.pricePNR = Math.round(Math.random() * 1000);
      if ('priceSMR' in columns) node.data.priceSMR = Math.round(Math.random() * 1000);
      if ('customPricePIR' in columns) node.data.customPricePIR = Math.round(Math.random() * 1000);
      if ('customPricePNR' in columns) node.data.customPricePNR = Math.round(Math.random() * 1000);
      if ('customPriceSMR' in columns) node.data.customPriceSMR = Math.round(Math.random() * 1000);

      // Totals (only if totals columns exist in headers)
      Object.entries(totalColumnsToCalc).forEach(([totalKey, parts]) => {
        if (!(totalKey in columns)) return;
        const total = parts
          .filter((k) => k in columns)
          .reduce((acc, k) => acc + Number(node.data[k] ?? 0), 0);
        node.data[totalKey] = total;
      });
    }

    function randomString(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }

    // Fill extra fields present in headers
    extraFieldKeys.forEach((fieldName) => {
      node.data[fieldName] = randomString(10);
    });

    if (hasChildren) {
      node.children = Array.from(
        { length: Math.floor(Math.random() * maxLevel) + 1 },
        (): ILocalNewTableRow => {
          const resNode = createNode(level + 1);

          return summAllChildrenForFields(resNode, calcColumns);
        },
      );
    }

    return node;
  };

  while (currentId < count) {
    const resNode = createNode();

    result.push(summAllChildrenForFields(resNode, calcColumns));
  }

  return result;
};
