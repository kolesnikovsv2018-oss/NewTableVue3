import type { INewTableHeaderSetting, INewTableHeaderSettings } from "../../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";

export const testColumnsSettings: Record<string, INewTableHeaderSetting> = {
  id: {
    width: 100,
    order: 1,
    visible: true,
  },
  name: {
    width: 250,
    order: 2,
    visible: true,
  },
  date: {
    width: 200,
    order: 2,
    visible: true,
  },
  status: {
    width: 150,
    order: 3,
    visible: true,
  },
  pricePNR: {
    width: 120,
    order: 4,
    visible: true,
  },
  pricePIR: {
    width: 120,
    order: 5,
    visible: true,
  },
  priceSMR: {
    width: 120,
    order: 6,
    visible: true,
  },
  priceTotal: {
    width: 130,
    order: 7,
    visible: true,
  },
  customPricePNR: {
    width: 130,
    order: 8,
    visible: true,
  },
  customPricePIR: {
    width: 130,
    order: 9,
    visible: true,
  },
  customPriceSMR: {
    width: 130,
    order: 10,
    visible: true,
  },
  customPriceTotal: {
    width: 140,
    order: 11,
    visible: true,
  },
};

export function generateExtraColumnsSettings(
  columnsToUpdate: Record<string, INewTableHeaderSetting>,
  extraFieldCount: number = 3
): INewTableHeaderSettings {
  const resultColumnsSettings = structuredClone(columnsToUpdate);

  for (let i = 1; i <= extraFieldCount; i++) {
    const fieldName = `extraField${i}`

    resultColumnsSettings[fieldName.toLowerCase()] = {
      width: 130,
      order: 11 + i,
      visible: true,
    };
  }

  return resultColumnsSettings;
}