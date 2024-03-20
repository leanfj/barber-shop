export default class CPF {
  private value: string;

  constructor(value: string) {
    this.setValue(value);
  }

  getValue(): string {
    return this.value;
  }

  private setValue(value: string): void {
    if (!this.isValid(value)) {
      throw new Error('CPF inválido');
    }
    this.value = value;
  }

  private isValid(cpf: string): boolean {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    const cpfWithoutMask = cpf.replace(/\D/g, '');

    if (cpfWithoutMask.length !== 11) {
      return false;
    }

    // Regra de calculo do dígito verificador
    let sum = 0;
    let rest;
    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(cpfWithoutMask.substring(i - 1, i)) * (11 - i);
    }
    rest = (sum * 10) % 11;

    if (rest === 10 || rest === 11) {
      rest = 0;
    }

    if (rest !== parseInt(cpfWithoutMask.substring(9, 10))) {
      return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(cpfWithoutMask.substring(i - 1, i)) * (12 - i);
    }

    rest = (sum * 10) % 11;

    if (rest === 10 || rest === 11) {
      rest = 0;
    }

    if (rest !== parseInt(cpfWithoutMask.substring(10, 11))) {
      return false;
    }

    return cpfRegex.test(cpf);
  }
}
