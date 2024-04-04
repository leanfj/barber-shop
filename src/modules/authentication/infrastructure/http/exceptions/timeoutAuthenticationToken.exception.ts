import { HttpException } from '../../../../../core/infrastructure/http/exceptions/http.exceptions';

export class TimeoutAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, 'Assinatura do Token expirada.');
  }
}
