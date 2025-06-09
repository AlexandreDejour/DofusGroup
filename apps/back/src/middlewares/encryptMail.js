import { encrypt } from './crypto.js';

function encryptMail(req, res, next) {
  if (req.body && req.body.mail) {
    try {
      req.body.mail = encrypt(req.body.mail);
    } catch (err) {
      return res.status(500).json({ error: "Encryption failed" });
    }
  }
  next();
}

export { encryptMail };
