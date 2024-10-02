export class Storage<T> {
  private storage: { [key: string]: T } = {};

  set(key: string, value: T): void {
    this.storage[key] = value;
  }

  get(key: string): T | undefined {
    return this.storage[key];
  }

  remove(key: string): void {
    delete this.storage[key];
  }

  clear(): void {
    this.storage = {};
  }

  values(): T[] {
    return Object.values(this.storage);
  }

  entries(): { key: string; value: T }[] {
    return Object.entries(this.storage).map(([key, value]) => ({ key, value }));
  }

  keys(): string[] {
    return Object.keys(this.storage);
  }

  searchKeys(pattern: RegExp): string[] {
    return Object.keys(this.storage).filter((key) => pattern.test(key));
  }

  searchValues(pattern: RegExp): { key: string; value: T }[] {
    return Object.entries(this.storage)
      .filter(([key]) => pattern.test(key))
      .map(([key, value]) => ({ key, value }));
  }
}
