import type { INewTableRow, INewTableRowTemplate } from "../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";

import { columnsToCalc } from './testColumns';

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
  count: number = 10000,
  maxLevel: number = 4,
  extraFieldCount: number = 3,
): ILocalNewTableRow[] => {
  const result: ILocalNewTableRow[] = [];
  let currentId = 0;

  const availableStatuses = ['active', 'completed', 'in-progress', 'not-started'];


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
        id: currentId,
        name: `${rowType} ${currentId}`,
        status: availableStatuses[Math.floor(Math.random() * availableStatuses.length)],
        date: new Date(Date.now() + (30 - Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString().replace(/T.*/, ''),
      },
    };

    if (!hasChildren) {
      node.data.pricePIR = Math.round(Math.random() * 1000);
      node.data.pricePNR = Math.round(Math.random() * 1000);
      node.data.priceSMR = Math.round(Math.random() * 1000);
      node.data.priceTotal = node.data.pricePIR + node.data.pricePNR + node.data.priceSMR;
      node.data.customPricePIR = Math.round(Math.random() * 1000);
      node.data.customPricePNR = Math.round(Math.random() * 1000);
      node.data.customPriceSMR = Math.round(Math.random() * 1000);
      node.data.customPriceTotal = node.data.customPricePIR + node.data.customPricePNR + node.data.customPriceSMR;
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

    for (let i = 1; i <= extraFieldCount; i++) {
      const fieldName = `extraField${i}`
      node.data[fieldName.toLowerCase()] = randomString(10);
    }

    if (hasChildren) {
      node.children = Array.from(
        { length: Math.floor(Math.random() * maxLevel) + 1 },
        (): ILocalNewTableRow => {
          const resNode = createNode(level + 1);

          return summAllChildrenForFields(resNode, columnsToCalc);
        },
      );
    }

    return node;
  };

  while (currentId < count) {
    const resNode = createNode();

    result.push(summAllChildrenForFields(resNode, columnsToCalc));
  }

  return result;
};

export const largeTestData = generateLargeTestData();