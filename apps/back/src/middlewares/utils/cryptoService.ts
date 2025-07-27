import crypto from "crypto";
import { Config } from "../../config/config.js";

export class CryptoService {
  private algorithm: string;
  private key: Buffer;
  private ivLength: number;

  constructor() {
    const config = Config.getInstance();
    this.algorithm = config.cryptoAlgorithm;
    this.key = Buffer.from(config.cryptoKey, "hex");
    this.ivLength = 12;

    if (!this.algorithm.includes("gcm")) {
      throw new Error("Unsupported algorithm: AES-GCM required");
    }
  }

  encrypt(data: string): string {
    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(
        this.algorithm,
        this.key,
        iv,
      ) as crypto.CipherGCM;

      const encrypted = Buffer.concat([
        cipher.update(data, "utf8"),
        cipher.final(),
      ]);

      const authTag = cipher.getAuthTag();

      return [
        iv.toString("hex"),
        authTag.toString("hex"),
        encrypted.toString("hex"),
      ].join(":");
    } catch (error) {
      throw new Error(`Encryption failed: ${(error as Error).message}`);
    }
  }

  decrypt(payload: string): string {
    const parts = payload.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid payload format, expected iv:tag:data");
    }

    const [ivHex, tagHex, encryptedHex] = parts;

    try {
      const iv = Buffer.from(ivHex, "hex");
      const authTag = Buffer.from(tagHex, "hex");
      const encrypted = Buffer.from(encryptedHex, "hex");

      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.key,
        iv,
      ) as crypto.DecipherCCM;
      decipher.setAuthTag(authTag);

      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);

      return decrypted.toString("utf8");
    } catch (error) {
      throw new Error(`Decryption failed: ${(error as Error).message}`);
    }
  }
}
