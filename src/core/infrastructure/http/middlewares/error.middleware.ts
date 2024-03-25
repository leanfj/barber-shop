import { type NextFunction, type Request, type Response } from 'express';
import { type HttpException } from '../exceptions/http.exceptions';

export function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const status = error.status ?? 500;
  const message = error.message ?? 'Something went wrong';
  response.status(status).send({
    message,
    status,
  });
}
