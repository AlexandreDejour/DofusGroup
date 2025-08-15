import DOMPurify from "dompurify";

export default function formDataToObject<T extends Record<string, string>>(
  formData: FormData,
  keys: (keyof T)[],
): T {
  const obj = Object.fromEntries(formData) as Record<string, string>;
  const result: Record<string, string> = {};

  keys.forEach((key) => {
    result[key as string] = DOMPurify.sanitize(obj[key as string] || "");
  });

  return result as T;
}
