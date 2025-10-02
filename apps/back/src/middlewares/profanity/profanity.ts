import leoProfanityPkg from "leo-profanity";
import type { Request, Response, NextFunction } from "express";

const leoProfanity = leoProfanityPkg.default ?? leoProfanityPkg;

// Loading dictionnaries
try {
  leoProfanity.loadDictionary("en");
  if ((leoProfanity as any).getDictionary) {
    const fr = (leoProfanity as any).getDictionary("fr");
    if (Array.isArray(fr)) leoProfanity.add(fr);
  } else {
    leoProfanity.add([]);
  }
} catch (err) {
  console.warn("leo-profanity preload failed:", err);
}

// --- Utils
function isPlainObject(v: any): v is Record<string, any> {
  if (v === null || typeof v !== "object") return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

function cleanValue(v: any): any {
  if (v == null) return v;
  if (typeof v === "string") {
    return typeof leoProfanity.clean === "function" ? leoProfanity.clean(v) : v;
  }
  if (typeof v === "number" || typeof v === "boolean") return v;
  if (v instanceof Date) return v; // garder l'instance
  if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(v))
    return v;
  if (v instanceof Map) {
    const m = new Map();
    for (const [k, val] of v.entries()) m.set(k, cleanValue(val));
    return m;
  }
  if (v instanceof Set) {
    const s = new Set();
    for (const val of v.values()) s.add(cleanValue(val));
    return s;
  }
  if (Array.isArray(v)) return v.map(cleanValue);
  if (isPlainObject(v)) {
    const out: any = {};
    for (const [k, val] of Object.entries(v)) out[k] = cleanValue(val);
    return out;
  }
  return v;
}

/**
 * Merge source (plain object or array) into target by mutating target in-place.
 * Returns true if merge succeeded in-place, false if not possible.
 */
function mergeIntoTarget(target: any, source: any): boolean {
  if (Array.isArray(target) && Array.isArray(source)) {
    target.length = 0;
    for (const it of source) target.push(it);
    return true;
  }
  if (isPlainObject(target) && isPlainObject(source)) {
    // supprimer clés obsolètes
    for (const k of Object.keys(target)) {
      if (!(k in source)) delete target[k];
    }
    // assigner/mettre à jour
    for (const [k, v] of Object.entries(source)) target[k] = v;
    return true;
  }
  return false;
}

// --- Middleware
export function profanityCleaner(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const cleanedBody = cleanValue(req.body);
    const cleanedQuery = cleanValue(req.query);
    const cleanedParams = cleanValue(req.params);

    // BODY
    if (req.body && typeof req.body === "object") {
      if (!mergeIntoTarget(req.body, cleanedBody)) {
        try {
          Object.defineProperty(req, "body", {
            value: cleanedBody,
            writable: true,
            configurable: true,
          });
        } catch (error) {
          // silent fallback
        }
      }
    } else {
      try {
        Object.defineProperty(req, "body", {
          value: cleanedBody,
          writable: true,
          configurable: true,
        });
      } catch (error) {
        console.warn(
          "[profanityCleaner] Impossible to redefine req.body → ignored fallback",
          error,
        );
      }
    }

    // QUERY
    if (req.query && typeof req.query === "object") {
      const ok = mergeIntoTarget(req.query, cleanedQuery);
      if (!ok) {
        try {
          Object.defineProperty(req, "query", {
            value: cleanedQuery,
            writable: true,
            configurable: true,
          });
        } catch (error) {}
      }
    } else {
      try {
        Object.defineProperty(req, "query", {
          value: cleanedQuery,
          writable: true,
          configurable: true,
        });
      } catch (error) {
        console.warn(
          "[profanityCleaner] Impossible to redefine req.query → ignored fallback",
          error,
        );
      }
    }

    // PARAMS
    if (req.params && typeof req.params === "object") {
      const ok = mergeIntoTarget(req.params, cleanedParams);
      if (!ok) {
        try {
          Object.defineProperty(req, "params", {
            value: cleanedParams,
            writable: true,
            configurable: true,
          });
        } catch (error) {}
      }
    } else {
      try {
        Object.defineProperty(req, "params", {
          value: cleanedParams,
          writable: true,
          configurable: true,
        });
      } catch (error) {
        console.warn(
          "[profanityCleaner] Impossible de définir req.query → ignored fallback",
          error,
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}
