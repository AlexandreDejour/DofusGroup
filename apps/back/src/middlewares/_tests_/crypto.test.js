import { describe, it, expect } from "vitest";
import { encrypt, decrypt, algorithm, ivLength } from "../crypto.js";

describe("Middleware crypto.js - Robustness Tests", () => {
  const clearText = "Test de chiffrement";

  it("encrypt() must return string with three parts separated by ':'", () => {
    const encrypted = encrypt(clearText);
    expect(typeof encrypted).toBe("string");
    const parts = encrypted.split(":");
    expect(parts.length).toBe(3);
    expect(parts[0].length).toBe(ivLength * 2);
    expect(parts[1].length).toBe(32);
    expect(parts[2].length).toBeGreaterThan(0);
  });

  it("decrypt() must return original text after encrypt()", () => {
    const encrypted = encrypt(clearText);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(clearText);
  });

  it("encrypt() must generate an different IV for each call", () => {
    const encrypted1 = encrypt(clearText);
    const encrypted2 = encrypt(clearText);
    expect(encrypted1).not.toBe(encrypted2);
  });

  it("decrypt() must failed if encrypt text format is unvalid", () => {
    const invalid = "badformattext";
    expect(() => decrypt(invalid)).toThrow();
  });

  it("decrypt() must failed if authTag is corrupted", () => {
    const encrypted = encrypt(clearText);
    const parts = encrypted.split(":");
    // Corrompre authTag (remplacer par '00' répété)
    parts[1] = "00".repeat(parts[1].length / 2);
    const corrupted = parts.join(":");
    expect(() => decrypt(corrupted)).toThrow();
  });

  it("decrypt() must failed if ciphertext is corrupted", () => {
    const encrypted = encrypt(clearText);
    const parts = encrypted.split(":");
    // Corrompre ciphertext (modifier dernier octet)
    const corruptedCipher = parts[2].slice(0, -2) + "00";
    parts[2] = corruptedCipher;
    const corrupted = parts.join(":");
    expect(() => decrypt(corrupted)).toThrow();
  });

  it("algorithm must be defined and start by'aes-256-gcm'", () => {
    expect(typeof algorithm).toBe("string");
    expect(algorithm.startsWith("aes-256-gcm")).toBe(true);
  });

  it("ivLength must be 12 (standard GCM)", () => {
    expect(ivLength).toBe(12);
  });
});
