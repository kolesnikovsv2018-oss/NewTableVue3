export function getComplexId(
  rowData: Record<string, unknown>,
  idFields: string[]
): string {
  // return idFields.map(field => rowData[field]).toString();
  return idFields.map(field => rowData[field]).join(',');
}
