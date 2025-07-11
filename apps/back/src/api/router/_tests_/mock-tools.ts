import { vi } from "vitest";
import express, { Express, NextFunction, Request, Response } from "express";
import status from "http-status";

export let app: Express;
export let receivedReq: Request | undefined;

export const setup = {
  App<TController>(
    controller: TController,
    createRouter: (controller: TController) => express.Router,
  ): Express {
    app = express();
    app.use(createRouter(controller));
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
