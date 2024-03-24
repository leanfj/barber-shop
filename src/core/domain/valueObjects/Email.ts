import { z } from 'zod';

export default class Email {
  private value: string;

  constructor(value: string) {
    this.setValue(value);
  }

  getValue(): string {
    return this.value;
  }

  private setValue(value: string): void {
    const valueSchema = z.string().email({ message: 'Email inválido' });
    const valueParsed = valueSchema.parse(value);

    this.value = valueParsed;
  }
}
