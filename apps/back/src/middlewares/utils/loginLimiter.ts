import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 attemps
  message: { error: "Too much attemps, try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
