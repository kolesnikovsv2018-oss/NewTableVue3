import type { INewTableColumn, INewTableColumns } from "../../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";

import { NEW_TABLE_DEFAULT_ROW_TYPE } from "../../../components/NewTable/constants/defaultRowType";

export const statusOptions = [
  { value: null, name: 'Not set' },
  { value: 'not-started', name: 'Not started' },
  { value: 'in-progress', name: 'In progress' },
  { value: 'completed', name: 'Completed' },
  { value: 'active', name: 'Active' },
];

// колонки, при изменнии которых, нужно посчитать суммы у родительских строк
export const columnsToCalc: string[] = [
  'pricePIR',
  'pricePNR',
  'priceSMR',
  'priceTotal',
  'customPricePIR',
  'customPricePNR',
  'customPriceSMR',
  'customPriceTotal'
];

// колонки, которые вычисляются путкм суммирования других
export const totalColumnsToCalc: Record<string, string[]> = {
  'priceTotal': ['pricePNR', 'pricePIR', 'priceSMR'],
  'customPriceTotal': ['customPricePNR', 'customPricePIR', 'customPriceSMR'],
};

export const testColumns: INewTableColumns = {
  id: {
    name: 'ID',
    key: 'id',
    meta: {
      width: 100,
    },
    components: {
      stage: {
        name: 'IdComponent',
        props: {},
      },
      subStage: {
        name: 'IdComponent',
        props: {},
      },
      task: {
        name: 'IdComponent',
        props: {},
      },
    },
  },
  name: {
    name: 'Name',
    key: 'name',
    meta: {
      width: 250,
    },
    components: {
      stage: {
        name: 'TextComponent',
        props: {},
      },
      subStage: {
        name: 'TextComponent',
        props: {},
      },
      task: {
        name: 'TextComponent',
        props: {},
      },
    },
  },
  date: {
    name: 'Date',
    key: 'date',
    meta: {
      width: 170,
    },
    components: {
      default: {
        name: 'DateComponent',
        props: {},
      },
    },
  },
  status: {
    name: 'Status',
    key: 'status',
    meta: {
      width: 150,
    },
    components: {
      stage: {
        name: 'SimpleSelectComponent',
        props: {
          options: statusOptions,
        },
      },
      subStage: {
        name: 'SimpleSelectComponent',
        props: {
          options: statusOptions,
        },
      },
      task: {
        name: 'SimpleSelectComponent',
        props: {
          options: statusOptions,
        },
      },
    },
  },
  pricePIR: {
    name: 'Price PIR',
    key: 'pricePIR',
    meta: {
      width: 120,
    },
    components: {
      stage: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
      subStage: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
      task: {
        name: 'PriceComponent',
        props: {},
      },
    },
  },
  pricePNR: {
    name: 'Price PNR',
    key: 'pricePNR',
    meta: {
      width: 120,
    },
    components: {
      stage: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
      subStage: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
      task: {
        name: 'PriceComponent',
        props: {},
      },
    },
  },
  priceSMR: {
    name: 'Price SMR',
    key: 'priceSMR',
    meta: {
      width: 120,
    },
    components: {
      stage: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
      subStage: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
      task: {
        name: 'PriceComponent',
        props: {},
      },
    },
  },
  priceTotal: {
    name: 'Price Total',
    key: 'priceTotal',
    meta: {
      width: 130,
    },
    components: {
      stage: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
      subStage: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
      task: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
    },
  },
  customPricePIR: {
    name: 'Custom Price PIR',
    key: 'customPricePIR',
    meta: {
      width: 120,
    },
    components: {
      stage: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
      subStage: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
      task: {
        name: 'PriceComponent',
        props: {},
      },
    },
  },
  customPricePNR: {
    name: 'Custom Price PNR',
    key: 'customPricePNR',
    meta: {
      width: 120,
    },
    components: {
      stage: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
      subStage: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
      task: {
        name: 'PriceComponent',
        props: {},
      },
    },
  },
  customPriceSMR: {
    name: 'Custom Price SMR',
    key: 'customPriceSMR',
    meta: {
      width: 120,
    },
    components: {
      stage: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
      subStage: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
      task: {
        name: 'PriceComponent',
        props: {},
      },
    },
  },
  customPriceTotal: {
    name: 'Custom Price Total',
    key: 'customPriceTotal',
    meta: {
      width: 130,
    },
    components: {
      stage: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
      subStage: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
      task: {
        name: 'PriceComponent',
        props: { mode: 'view' },
      },
    },
  },
};

export function generateExtraColumns(
  columnsToUpdate: INewTableColumns,
  extraFieldCount: number = 3
): INewTableColumns {
  const resultColumns = structuredClone(columnsToUpdate);

  for (let i = 1; i <= extraFieldCount; i++) {
    const fieldName = `extraField${i}`

    const newColumn: INewTableColumn = {
      key: fieldName.toLowerCase(),
      name: fieldName,
      components: {
        [NEW_TABLE_DEFAULT_ROW_TYPE]: {
          name: 'TextComponent',
          props: {},
        },
      },
    };

    resultColumns[fieldName] = newColumn;
  }

  return resultColumns;
}