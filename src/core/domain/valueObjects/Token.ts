import { type Secret, sign } from 'jsonwebtoken';
import { ValueObject } from './ValueObjects';

interface TokenProps {
  value: string;
}

export default class TokenVO extends ValueObject<TokenProps> {
  constructor(props: TokenProps) {
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
  }): Promise<TokenVO> {
    const valueParsed = await this.generateToken(value);
    return new TokenVO({ value: valueParsed });
  }

  private static async generateToken(data: {
    id: string;
    nome: string;
    email: string;
    tenantId: string;
  }): Promise<string> {
    const { JWT_SECRET } = process.env;

    const tokenJWT = sign(data, JWT_SECRET as Secret, {
      expiresIn: '1d',
    });

    return tokenJWT;
  }
}
