import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import colors from 'colors/safe';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import helmet from 'helmet';
import { type IBaseController } from './IBaseController';

export default class App {
  public app: express.Application;
  private readonly port: number;

  constructor(controllers: IBaseController[]) {
    this.app = express();
    this.port = this.normalizePort(process.env.PORT ?? '3333');
    this.initializeHelmet();
    this.initializeMiddlewares();
    this.initializeLogger();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen(): any {
    return this.app.listen(this.port, () => {
      console.log(
        colors.bold(
          colors.bgGreen(
            colors.black('-----Servidor iniciado com sucesso!-----'),
          ),
        ),
      );
      console.log(
        colors.bold(
          colors.bgGreen(
            colors.black(`-----App listening on the port ${this.port}-----`),
          ),
        ),
      );
    });
  }

  public getServer(): express.Application {
    return this.app;
  }

  private initializeMiddlewares(): void {
    this.app.use(
      cors({
        origin: 'http://localhost:3000',
        credentials: true,
        methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
      }),
    );
    this.app.use(cookieParser());
    this.app.use(express.json());
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  private initializeLogger(): void {
    this.app.use(loggerMiddleware);
  }

  private initializeHelmet(): void {
    this.app.use(helmet());
  }

  private initializeControllers(controllers: IBaseController[]): void {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private normalizePort(val: string): number {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      return parseInt(val, 10);
    }

    if (port >= 0) {
      return port;
    }

    return 3333;
  }
}
