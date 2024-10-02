export const createArray = <T>(length: number, defaultValue?: T): T[] =>
  Array.from({ length }).fill(defaultValue) as T[];

export const randomNumber = (max = 10, min = 0): number =>
  Math.ceil(Math.random() * (max - min) + min);

export const genKey = (...args: Array<string | number>): string =>
  args.join("_");

export const parseKey = (key: string): string[] => key.split("_");

export const pickRandomElement = <T>(elements: Array<T>): T =>
  elements[randomNumber(elements.length - 1)];

export const isIn = <T extends object>(
  objectToCheck: T,
  propertyName: keyof T
): boolean => Boolean(objectToCheck) && propertyName in objectToCheck;
