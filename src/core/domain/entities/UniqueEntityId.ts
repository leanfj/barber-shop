import { randomUUID } from 'node:crypto';

import Identifier from './Identifier';

export default class UniqueEntityId extends Identifier<string> {
  constructor(id?: string) {
    super(id ?? randomUUID());
  }
}
