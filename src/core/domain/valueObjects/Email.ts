export default class Email {
  private value: string;

  constructor(value: string) {
    this.setValue(value);
  }

  getValue(): string {
    return this.value;
  }

  private setValue(value: string): void {
    if (!this.isValid(value)) {
      throw new Error('Email inválido');
    }
    this.value = value;
  }

  private isValid(email: string): boolean {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }
}
