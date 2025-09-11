import DOMPurify from "dompurify";

export default function formDataToObject<
  T extends Record<string, string | number | boolean>,
>(formData: FormData, keys: (keyof T)[]): T {
  const obj = Object.fromEntries(formData) as Record<string, string>;
  const result: Partial<T> = {};

  keys.forEach((key) => {
    const raw = obj[key as string] ?? "";

    const sanitized = DOMPurify.sanitize(raw);

    if (typeof ({} as T)[key] === "number") {
      (result as any)[key] = Number(sanitized);
    } else if (typeof ({} as T)[key] === "boolean") {
      (result as any)[key] = sanitized === "true";
    } else {
      (result as any)[key] = sanitized;
    }
  });

  return result as T;
}
