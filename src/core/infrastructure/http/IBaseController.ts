import { type Response, Router } from 'express';

export abstract class IBaseController {
  public router = Router();

  public static jsonResponse(
    res: Response,
    code: number,
    message: string,
  ): Response {
    return res.status(code).json({ message });
  }

  public ok<T>(res: Response, dto?: T): Response {
    if (dto !== undefined) {
      res.type('application/json');
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  public created(res: Response): Response {
    return res.sendStatus(201);
  }

  public clientError(res: Response, message?: string): Response {
    return IBaseController.jsonResponse(res, 400, message ?? 'Bad Request');
  }

  public unauthorized(res: Response, message?: string): Response {
    return IBaseController.jsonResponse(res, 401, message ?? 'Unauthorized');
  }

  public paymentRequired(res: Response, message?: string): Response {
    return IBaseController.jsonResponse(
      res,
      402,
      message ?? 'Payment required',
    );
  }

  public forbidden(res: Response, message?: string): Response {
    return IBaseController.jsonResponse(res, 403, message ?? 'Forbidden');
  }

  public notFound(res: Response, message?: string): Response {
    return IBaseController.jsonResponse(res, 404, message ?? 'Not found');
  }

  public conflict(res: Response, message?: string): Response {
    return IBaseController.jsonResponse(res, 409, message ?? 'Conflict');
  }

  public tooMany(res: Response, message?: string): Response {
    return IBaseController.jsonResponse(
      res,
      429,
      message ?? 'Too many requests',
    );
  }

  public todo(res: Response): Response {
    return IBaseController.jsonResponse(res, 400, 'TODO');
  }

  public invalidInput(res: Response, message?: string): Response {
    return IBaseController.jsonResponse(res, 422, message ?? 'Invalid request');
  }

  public fail(res: Response, error: Error | string): Response {
    console.error(error);
    return res.status(500).json({
      message: error.toString(),
    });
  }
}
