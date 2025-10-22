import { TargetType } from "../modalContext";

import { TranslationKeys } from "../../i18n/i18n-helper";
import { NotificationContextType } from "../notificationContext";

interface ApiError {
  type: "API_ERROR";
  status?: number;
  message: string;
  original?: unknown;
}

export function displayTargetError(
  error: unknown,
  t: (key: TranslationKeys, options?: Record<string, unknown>) => string,
  showError: NotificationContextType["showError"],
  targetType?: TargetType,
) {
  let title = t("system.error.default");
  let message = t("system.error.occurred");

  if (
    typeof error === "object" &&
    error &&
    (error as ApiError).type === "API_ERROR"
  ) {
    const apiError = error as ApiError;

    switch (apiError.status) {
      case 400:
        message = t("system.error.badRequest");
        break;

      case 401:
        message = t("system.error.unauthorized");
        break;

      case 403:
        message = t("system.error.forbidden");
        break;

      case 404:
        message = t("system.error.notFound");
        break;

      case 429:
        message = t("system.error.attemps");
        break;

      case 500:
        message;
        break;

      default:
        message = apiError.message || t("system.error.occurred");
        break;
    }

    if (modalType === "login" && apiError.status === 401) {
      message = t("auth.error.credentials.invalid");
    }

    if (modalType === "register" && apiError.status === 409) {
      message = t("auth.error.credentials.unavailable");
    }
  }

  showError(title, message);
}
