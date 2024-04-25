import { z } from 'zod';
import { ValueObject } from './ValueObjects';

interface CPFProps {
  value: string;
}

export default class CPF extends ValueObject<CPFProps> {
  constructor(props: CPFProps) {
    super(props);
  }

  getValue(): string {
    return this.props.value;
  }

  public static setValue(value: string): CPF {
    const valueSchema = z.string().refine(
      (cpf: string) => {
        if (!cpf) {
          return false;
        }

        cpf = cpf.replace(/[^\d]+/g, '');

        if (CPF.isValueMoreThanElevenDigits(cpf)) {
          return false;
        }
        if (CPF.isValueRepeated(cpf)) {
          return false;
        }
        if (!CPF.isCPFWithValidDigits(cpf)) {
          return false;
        }

        return true;
      },
      {
        message: 'CPF Invalido',
      },
    );

    const valueParsed = valueSchema.parse(value);

    return new CPF({ value: valueParsed });
  }

  private static isValueMoreThanElevenDigits(value: string): boolean {
    return value.length > 11;
  }

  private static isValueRepeated(value: string): boolean {
    return value.match(/(\d)\1{10}/) !== null;
  }

  private static isCPFWithValidDigits(value: string): boolean {
    const digitosCPF = value.split('').map((el) => +el);
    const rest = (count: number): number => {
      return (
        ((digitosCPF
          .slice(0, count - 12)
          .reduce((soma, el, index) => soma + el * (count - index), 0) *
          10) %
          11) %
        10
      );
    };
    return rest(10) === digitosCPF[9] && rest(11) === digitosCPF[10];
  }
}
