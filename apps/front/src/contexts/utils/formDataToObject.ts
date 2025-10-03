import DOMPurify from "dompurify";

export default function formDataToObject<T extends Record<string, any>>(
  formData: FormData,
  {
    keys,
    booleanKeys = [],
    numberKeys = [],
    dateKeys = [],
    arrayKeys = [],
  }: {
    keys: (keyof T)[];
    booleanKeys?: (keyof T)[];
    numberKeys?: (keyof T)[];
    dateKeys?: (keyof T)[];
    arrayKeys?: (keyof T)[];
  },
): T {
  // entries sous forme [key, value] (value peut être string ou File)
  const entries = Array.from(formData.entries());
  const obj = entries.reduce<Record<string, FormDataEntryValue>>(
    (acc, [k, v]) => {
      // si plusieurs valeurs pour la même clé, Object.fromEntries garderait la dernière,
      // on utilisera getAll pour arrayKeys quand nécessaire.
      acc[k] = v;
      return acc;
    },
    {},
  );

  const result: Partial<T> = {};

  keys.forEach((key) => {
    const k = key as string;

    if (booleanKeys.includes(key)) {
      (result as any)[key] = formData.has(k);
      return;
    }

    if (arrayKeys.includes(key)) {
      const rawValues = formData
        .getAll(k)
        .map((v) => (typeof v === "string" ? DOMPurify.sanitize(v) : v));
      (result as any)[key] = rawValues.filter((val) => val !== "");
      return;
    }

    const raw = obj[k];

    if (raw === undefined || raw === "") {
      return;
    }

    if (numberKeys.includes(key)) {
      if (typeof raw === "string") {
        const safe = DOMPurify.sanitize(raw);
        (result as any)[key] = Number(safe);
      }
      return;
    }

    if (dateKeys.includes(key)) {
      if (typeof raw === "string") {
        const safe = DOMPurify.sanitize(raw);
        (result as any)[key] = new Date(safe);
      }
      return;
    }

    // Default : string or File
    if (typeof raw === "string") {
      (result as any)[key] = DOMPurify.sanitize(raw);
    } else {
      // File (input type="file") ou autre
      (result as any)[key] = raw;
    }
  });

  return result as T;
}
