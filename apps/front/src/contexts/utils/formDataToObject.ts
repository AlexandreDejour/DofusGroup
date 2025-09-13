import DOMPurify from "dompurify";

export default function formDataToObject<
  T extends Record<
    string,
    string | string[] | number | boolean | Date | undefined
  >,
>(
  formData: FormData,
  keys: (keyof T)[],
  booleanKeys: (keyof T)[] = [],
  numberKeys: (keyof T)[] = [],
  dateKeys: (keyof T)[] = [],
  arrayKeys: (keyof T)[] = [],
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
    } else if (dateKeys.includes(key)) {
      const raw = obj[key as string];
      if (raw !== undefined && raw !== "") {
        // on sanitize puis on crée un Date
        const safe = DOMPurify.sanitize(raw);
        (result as any)[key] = new Date(safe);
      }
    } else if (arrayKeys.includes(key)) {
      const rawValues = formData.getAll(key as string);
      (result as any)[key] = rawValues
        .map((val) => DOMPurify.sanitize(val as string))
        .filter((val) => val !== ""); // clean & ignore vides
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
