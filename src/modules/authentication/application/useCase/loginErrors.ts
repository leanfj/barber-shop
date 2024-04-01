import { UseCaseError } from '../../../../core/application/useCase/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace LoginErrors {
  export class PasswordOrEmailIncorrect extends Result<UseCaseError> {
    constructor() {
      super(false, new UseCaseError('Email ou senha incorretos'));
    }
  }

  export class UserNotFoundEmail extends Result<UseCaseError> {
    constructor() {
      super(
        false,
        new UseCaseError('Caso usuário exista, o e-mail será enviado'),
      );
    }
  }

  export class UserNotFound extends Result<UseCaseError> {
    constructor(usuario: string) {
      super(false, new UseCaseError(`Usuário ${usuario} não encontrado`));
    }
  }
}
