import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { errorMiddleware } from './common/middlewares/error.middleware';
import { IRouter } from './common/interfaces/route.interface';

class App {
  public app: Application;

  constructor(routers: IRouter[]) {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes(routers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(morgan('dev'));
    this.app.use(express.json());
  }

  private initializeRoutes(routers: IRouter[]): void {
    routers.forEach(({ path, router }) => {
      this.app.use(path, router);
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  public listen(): void {
    const port = process.env.PORT || 5000;
    this.app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  }
}

export default App;
