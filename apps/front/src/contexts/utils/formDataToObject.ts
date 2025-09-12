import DOMPurify from "dompurify";

export default function formDataToObject<
  T extends Record<string, string | number | boolean | undefined>,
>(
  formData: FormData,
  keys: (keyof T)[],
  booleanKeys: (keyof T)[] = [],
  numberKeys: (keyof T)[] = [],
): T {
  const obj = Object.fromEntries(formData) as Record<string, string>;
  const result: Partial<T> = {};

  keys.forEach((key) => {
    if (booleanKeys.includes(key)) {
      // For checkbox, key exist if checked, else missing
      (result as any)[key] = formData.has(key as string);
    } else if (numberKeys.includes(key)) {
      const raw = obj[key as string];
      if (raw !== undefined && raw !== "") {
        (result as any)[key] = Number(DOMPurify.sanitize(raw));
      }
      // else, don't add key
    } else {
      const raw = obj[key as string];
      if (raw !== undefined && raw !== "") {
        (result as any)[key] = DOMPurify.sanitize(raw);
      }
      // else, don't add key
    }
  });

  return result as T;
}
