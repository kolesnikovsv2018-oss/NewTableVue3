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
