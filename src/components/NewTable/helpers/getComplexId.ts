/**
 * Получение составного ID строки
 * @param {Record<string, unknown>} rowData Данные строки
 * @param {string[]} idFields Поля, из которых состоит составной ID
 * @returns {string} Составной ID строки
 */
export function getComplexId(
  rowData: Record<string, unknown>,
  idFields: string[]
): string {
  return idFields.map(field => rowData[field] as string).join(',');
  // return idFields.map(field => {
  //   const value = rowData[field];
  //   if (value === null || value === undefined) return '';
  //   if (typeof value === 'object') return JSON.stringify(value);
  //   // At this point value is a primitive (string, number, boolean, etc.)
  //   // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
  //   return `${value}`;
  // }).join(',');
}
