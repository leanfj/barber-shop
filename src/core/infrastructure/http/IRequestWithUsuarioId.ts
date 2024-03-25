import { type Request } from 'express';

export interface IRequestWithUsuarioId extends Request {
  usuarioId: string;
}
