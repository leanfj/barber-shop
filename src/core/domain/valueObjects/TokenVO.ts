import { type Secret, sign } from 'jsonwebtoken';
import { ValueObject } from './ValueObjects';
import { EnvConstants } from '../../../env/envContants';

interface TokenProps {
  value: string;
  expiresIn?: string;
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
    expiresIn?: string;
  }): Promise<TokenVO> {
    const valueParsed = await this.generateToken(value);
    return new TokenVO({ value: valueParsed });
  }

  private static async generateToken(data: {
    id: string;
    nome: string;
    email: string;
    tenantId: string;
    expiresIn?: string;
  }): Promise<string> {
    const tokenJWT = sign(data, EnvConstants.JWT_SECRET as Secret, {
      expiresIn: data.expiresIn ?? '1d',
    });

    return tokenJWT;
  }
}
