import "dotenv/config";

import crypto from "crypto";

const algorithm = process.env.CRYPTO_ALGORITHM;
const key = Buffer.from(process.env.CRYPTO_KEY, 'hex'); // 32 bytes secret key (256 bits)
const ivLength = 12; // Standard length IV pour GCM

// Function to encrypt a clear text
function encrypt(text) {
  const iv = crypto.randomBytes(ivLength); // Unique init vector
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  // Returns iv, tag and ciphertext for later decryption
  return iv.toString("hex") + ":" + authTag + ":" + encrypted;
}

// Function to decrypt encryptedText
function decrypt(encryptedText) {
  const parts = encryptedText.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const authTag = Buffer.from(parts[1], "hex");
  const encrypted = parts[2];

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export { encrypt, decrypt, algorithm, ivLength };

