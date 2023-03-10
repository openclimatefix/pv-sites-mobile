import { start } from 'repl';

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

export enum Value {
  Min = 'Minimum',
  Max = 'Maximum',
}
interface MinMaxInterface {
  type: Value;
  index: number;
}

/**
 * Determines the next local minimum or maximum value in an array given a start index
 * @param array Array to search for a local minimum or maximum value
 * @param key The key that represents the values being compared in array
 * @param startIndex The index to start the search at
 * @returns The index of the next minimum or maximum value
 */
export const getArrayMaxOrMinAfterIndex = (
  array: Record<string, any>,
  key: string,
  startIndex: number
): MinMaxInterface | null => {
  if (startIndex === array.length - 1) {
    return {
      type: Value.Min,
      index: startIndex,
    };
  }

  startIndex += 1;

  while (startIndex < array.length) {
    const currentExpectedGenerationKW = array[startIndex][key];
    const previousExpectedGenerationKW = array[startIndex - 1][key];

    if (startIndex === array.length - 1) {
      if (currentExpectedGenerationKW > previousExpectedGenerationKW) {
        return {
          type: Value.Max,
          index: startIndex,
        };
      } else if (currentExpectedGenerationKW < previousExpectedGenerationKW) {
        return {
          type: Value.Min,
          index: startIndex,
        };
      }
    } else {
      const nextExpectedGenerationKW = array[startIndex + 1][key];

      if (
        currentExpectedGenerationKW > previousExpectedGenerationKW &&
        currentExpectedGenerationKW > nextExpectedGenerationKW
      ) {
        return {
          type: Value.Max,
          index: startIndex,
        };
      } else if (
        currentExpectedGenerationKW < previousExpectedGenerationKW &&
        currentExpectedGenerationKW < nextExpectedGenerationKW
      ) {
        return {
          type: Value.Min,
          index: startIndex,
        };
      }
    }
    startIndex += 1;
  }
  return null;
};
