import { addSeconds } from 'date-fns';
import { ValueObject } from './ValueObjects';

interface DataExpiracaoProps {
  value: string;
}

export default class DataExpiracao extends ValueObject<DataExpiracaoProps> {
  constructor(props: DataExpiracaoProps) {
    super(props);
  }

  getValue(): string {
    return this.props.value;
  }

  public static setValue(): DataExpiracao {
    const valueParsed = addSeconds(new Date(), 15).getTime();
    return new DataExpiracao({ value: valueParsed.toString() });
  }
}
