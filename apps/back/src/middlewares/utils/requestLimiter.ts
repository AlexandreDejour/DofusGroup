import rateLimit from "express-rate-limit";

export const requestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 attemps
  message: { error: "Too much attemps, try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
