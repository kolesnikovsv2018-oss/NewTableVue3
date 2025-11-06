export function getComplexId(rowData: Record<string, any>, idFields: string[]): string {
  return idFields.map(field => rowData[field]).toString();
}
