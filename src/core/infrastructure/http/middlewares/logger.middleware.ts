import { type NextFunction, type Request, type Response } from 'express';
import colors from 'colors/safe';

export function loggerMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  console.log(`${colors.bold(colors.green(request.method))} ${request.path}`);
  next();
}
