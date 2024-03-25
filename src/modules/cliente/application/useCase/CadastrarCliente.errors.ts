import { type ZodError } from 'zod';
import { UseCaseError } from '../../../../core/application/useCase/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace CadastartClienteErrors {
  export class ClienteAlreadyExists extends Result<UseCaseError> {
    constructor(nome: string) {
      super(false, new UseCaseError(`Cliente com nome ${nome} já existe.`));
    }
  }

  export class InvalidData extends Result<UseCaseError> {
    constructor(data: ZodError) {
      super(
        false,
        new UseCaseError(data.issues.map((issue) => issue.message).join(', ')),
      );
    }
  }
}
