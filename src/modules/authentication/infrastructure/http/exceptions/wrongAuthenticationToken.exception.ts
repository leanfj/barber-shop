import { HttpException } from '../../../../../core/infrastructure/http/exceptions/http.exceptions';

export class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, 'Token de autenticação inválido.');
  }
}
