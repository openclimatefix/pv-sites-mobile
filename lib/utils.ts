/**
 * Turn a HTML element ID string (an-element-id) into camel case (anElementId)
 * @param id the HTML element id
 * @returns the id in camel case
 */
export function camelCaseID(id: string) {
  const [first, ...rest] = id.split('-');
  const capitalize = (part: string) =>
    part[0].toUpperCase() + part.substring(1);
  return [first, ...rest.map(capitalize)].join('');
}
