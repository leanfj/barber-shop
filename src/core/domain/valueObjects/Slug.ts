import { ValueObject } from './ValueObjects';

interface SlugProps {
  value: string;
}

export default class Slug extends ValueObject<SlugProps> {
  constructor(props: SlugProps) {
    super(props);
  }

  getValue(): string {
    return this.props.value;
  }

  public static setValue(value: string): Slug {
    const valueParsed = value.split(' ').join('-').toLowerCase();
    return new Slug({ value: valueParsed });
  }
}
