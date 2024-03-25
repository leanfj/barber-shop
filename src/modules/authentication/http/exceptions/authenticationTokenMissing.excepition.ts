import { HttpException } from '../../../../core/infrastructure/http/exceptions/http.exceptions';

export class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super(401, 'Authentication token missing');
  }
}
