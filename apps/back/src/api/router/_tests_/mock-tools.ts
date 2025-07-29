import { vi } from "vitest";
import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
} from "express";
import status from "http-status";
import cookieParser from "cookie-parser";

import { AuthService } from "../../../middlewares/utils/authService.js";

export let app: Express;
export let receivedReq: Request | undefined;

export const setup = {
  App<TController, TArgs extends unknown[]>(
    controller: TController,
    routerFactory: (controller: TController, ...args: TArgs) => Router,
    options?: { routerFactoryArgs?: TArgs },
  ): Express {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    const args = options?.routerFactoryArgs ?? ([] as unknown as TArgs);

    for (const arg of args) {
      if (arg instanceof AuthService) {
        app.use(arg.setAuthUserRequest.bind(arg));
      }
    }

    const router = routerFactory(controller, ...args);
    app.use(router);

    app.use((_req, res) => {
      res.status(status.NOT_FOUND).json({ called: "next" });
    });

    return app;
  },

  mockSucessCall(statusCode: number) {
    return vi
      .fn()
      .mockImplementationOnce(
        (req: Request, res: Response, _next: NextFunction): Promise<void> => {
          receivedReq = req;
          res.status(statusCode).json("Success!");
          return Promise.resolve();
        },
      );
  },

  mockNextCall() {
    return vi
      .fn()
      .mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
          next();
          return Promise.resolve();
        },
      );
  },
};
