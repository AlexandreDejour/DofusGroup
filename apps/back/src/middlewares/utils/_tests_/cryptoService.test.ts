import { describe, it, expect, beforeAll } from "vitest";
import { CryptoService } from "../cryptoService.js";

describe("CryptoService", () => {
  let cryptoService: CryptoService;
  const input = "toto@example.com";

  beforeAll(() => {
    cryptoService = new CryptoService();
  });

  it("should encrypt and decrypt correctly", () => {
    const encrypted = cryptoService.encrypt(input);
    expect(typeof encrypted).toBe("string");
    expect(encrypted).not.toBe(input);

    const decrypted = cryptoService.decrypt(encrypted);
    expect(decrypted).toBe(input);
  });

  it("should throw error when decrypting malformed payload", () => {
    expect(() => cryptoService.decrypt("invalid-payload")).toThrow(
      /Invalid payload format/,
    );
  });

  it("should throw error if decrypting with tampered data", () => {
    const encrypted = cryptoService.encrypt(input);

    // Modify one char of string
    const tampered =
      encrypted.slice(0, -1) + (encrypted.slice(-1) === "a" ? "b" : "a");

    expect(() => cryptoService.decrypt(tampered)).toThrow(/Decryption failed/);
  });
});
