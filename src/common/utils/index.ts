export const createArray = <T>(length: number, defaultValue?: T): T[] =>
  Array.from({ length }).fill(defaultValue) as T[];
export const randomNumber = (max = 10, min = 0): number =>
  Math.ceil(Math.random() * (max - min) + min);

export const genKey = (...args: Array<string | number>): string =>
  args.join("_");
