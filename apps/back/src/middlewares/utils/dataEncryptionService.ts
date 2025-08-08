import { Request, Response, NextFunction } from "express";

import { CryptoService } from "./cryptoService.js";

export class DataEncryptionService {
  constructor(private cryptoService: CryptoService) {}

  fieldsToEncrypt = ["mail"];

  encryptData = (req: Request, _res: Response, next: NextFunction) => {
    if (!req.body) return next();

    try {
      for (const key of this.fieldsToEncrypt) {
        if (req.body[key]) {
          req.body[key] = this.cryptoService.encrypt(req.body[key]);
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };

  decryptData = (req: Request, _res: Response, next: NextFunction) => {
    if (!req.body) return next();

    try {
      for (const key of this.fieldsToEncrypt) {
        if (req.body[key]) {
          req.body[key] = this.cryptoService.decrypt(req.body[key]);
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
