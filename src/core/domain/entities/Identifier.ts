export default class Identifier<T> {
  constructor(private readonly value: T) {
    this.value = value;
  }

  equals(id?: Identifier<T>): boolean {
    if (!id) {
      return false;
    }
    if (!(id instanceof this.constructor)) {
      return false;
    }
    return id.toValue() === this.value;
  }

  toString(): string {
    return String(this.value);
  }

  /**
   * Return raw value of identifier
   */

  toValue(): T {
    return this.value;
  }
}
