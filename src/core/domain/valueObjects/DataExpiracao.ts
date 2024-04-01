import { addSeconds } from 'date-fns';
import { ValueObject } from './ValueObjects';

interface DataExpiracaoProps {
  value: number;
}

export default class DataExpiracao extends ValueObject<DataExpiracaoProps> {
  constructor(props: DataExpiracaoProps) {
    super(props);
  }

  getValue(): number {
    return this.props.value;
  }

  public static setValue(): DataExpiracao {
    const valueParsed = addSeconds(new Date(), 15).getTime();
    return new DataExpiracao({ value: valueParsed });
  }
}
