/**
 * Функция которая будет использована для сравнения значения фильтра для ячейки
 * со значением самой ячейки, значения будут сравниваться как строки.
 * Эта функция будет вызвана в том случае. если в заголовке для ячейки не задан массив с правилами.
 *
 * По умолчанию применяется регулярное выраюение, которое независимо от регистра
 * проверяет является ли значение в фильтре частью строки в ячейки.
 *
 * @param {String} filterString - первым аргументом, принимает значение фильтра для текущей колонки
 * @param {String} cellData - вторым аргументом, принимает значение самой ячейки,
 * эта функция будет вызываться в NewTable для каждой ячейки,
 * и, соответственно, эта функция будет вызвана последовательно для всего набора данных
 * @param {String} patternFlags - флаги для регулярного выражения, по умолчанию - gmi
 */
export function compareFilterAsString(
  filterString?: string | null,
  cellData?: string | null,
  patternFlags: string = "gmi"
): boolean {
  if (filterString === cellData) {
    return true;
  }

  if (!filterString || !cellData) {
    return false;
  }

  const reg = new RegExp(".*" + filterString + ".*", patternFlags);

  return reg.test(cellData);
}
