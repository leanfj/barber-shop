import { type Secret, sign } from 'jsonwebtoken';
import { ValueObject } from './ValueObjects';

interface RefreshTokenProps {
  value: string;
  expiresIn?: string;
}

export default class RefreshTokenVO extends ValueObject<RefreshTokenProps> {
  constructor(props: RefreshTokenProps) {
    super(props);
  }

  getValue(): string {
    return this.props.value;
  }

  public static async setValue(value: {
    id: string;
    nome: string;
    email: string;
    tenantId: string;
    expiresIn?: string;
  }): Promise<RefreshTokenVO> {
    const valueParsed = await this.generateToken(value);
    return new RefreshTokenVO({ value: valueParsed });
  }

  private static async generateToken(data: {
    id: string;
    nome: string;
    email: string;
    tenantId: string;
    expiresIn?: string;
  }): Promise<string> {
    const { JWT_SECRET } = process.env;

    const tokenJWT = sign(data, JWT_SECRET as Secret, {
      expiresIn: data.expiresIn ?? '30d',
    });

    return tokenJWT;
  }
}
