import "./VerifyEmail.scss";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { useModal } from "../../contexts/modalContext";
import { AuthService } from "../../services/api/authService";

export default function VerifyEmail() {
  const { t } = useTranslation("verifyEmail");
  const { openModal } = useModal();

  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    const config = Config.getInstance();
    const axios = new ApiClient(config.backUrl);
    const authService = new AuthService(axios);

    const verify = async () => {
      try {
        const response = await authService.validateEmail(token);

        setStatus(response);
      } catch (error) {
        setStatus("error");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <main className="verifyEmail">
      <header>
        <h2>{t("header.title")}</h2>
      </header>

      <section>
        {status !== "loading" ? (
          status === "success" ? (
            <p>{t("message.verified")}</p>
          ) : (
            <>
              <p>{t("message.notVerified")}</p>
              <button
                type="button"
                className="resend button"
                onClick={() => openModal("mailToken")}
              >
                {t("message.resend")}
              </button>
            </>
          )
        ) : (
          <p>{t("message.waiting")}</p>
        )}
      </section>
    </main>
  );
}
