import { Request, Response, NextFunction } from "express";

import { CryptoService } from "./cryptoService.js";

export class DataEncryptionService {
  constructor(private cryptoService: CryptoService) {}

  fieldsToEncrypt = ["email"];

  encryptData(req: Request, _res: Response, next: NextFunction) {
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
  }

  decryptData(encryptedFields: { [key: string]: string }): {
    [key: string]: string;
  } {
    const decryptedFields: { [key: string]: string } = {};

    for (const key in encryptedFields) {
      try {
        decryptedFields[key] = this.cryptoService.decrypt(encryptedFields[key]);
      } catch (error) {
        throw new Error(
          `Decryption failed for field "${key}": ${(error as Error).message}`,
        );
      }
    }

    return decryptedFields;
  }
}
