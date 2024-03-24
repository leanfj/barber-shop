import { z } from 'zod';
import { ValueObject } from './ValueObjects';

interface EmailProps {
  value: string;
}

export default class Email extends ValueObject<EmailProps> {
  constructor(props: EmailProps) {
    super(props);
  }

  getValue(): string {
    return this.props.value;
  }

  public static setValue(value: string): Email {
    const valueSchema = z.string().email({ message: 'Email inválido' });
    const valueParsed = valueSchema.parse(value);

    return new Email({ value: valueParsed });
  }
}
