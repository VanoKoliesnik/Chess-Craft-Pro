type StorageObject<V, K extends string> = { [key in K]: V };

export class Storage<V, K extends string = string> {
  private storage: StorageObject<V, K> = {} as StorageObject<V, K>;

  set(key: K, value: V): void {
    this.storage[key] = value;
  }

  get(key: K): V | undefined {
    return this.storage[key];
  }

  remove(key: K): void {
    delete this.storage[key];
  }

  clear(): void {
    this.storage = {} as StorageObject<V, K>;
  }

  keys(): K[] {
    return Object.keys(this.storage) as K[];
  }

  searchKeys(pattern: RegExp): string[] {
    return Object.keys(this.storage).filter((key) => pattern.test(key));
  }

  searchValues(pattern: RegExp): V[] {
    return Object.entries(this.storage)
      .filter(([key]) => pattern.test(key))
      .map(([, value]) => value as V);
  }
}
