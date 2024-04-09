import { type ZodError } from 'zod';
import { UseCaseError } from '../../../../core/application/useCase/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace AtivarUsuarioErrors {
  export class UsuarioNotExists extends Result<UseCaseError> {
    constructor() {
      super(false, new UseCaseError(`Usuario não encontrado.`));
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

  export class TokenInvalid extends Result<UseCaseError> {
    constructor() {
      super(false, new UseCaseError(`Token inválido.`));
    }
  }

  export class TokenNotExists extends Result<UseCaseError> {
    constructor() {
      super(false, new UseCaseError(`Token não encontrado.`));
    }
  }
}
