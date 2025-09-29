import "./PrivacyPolicy.scss";

import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  const CONTACT_EMAIL = "";
  const { t } = useTranslation("privacyPolicy");

  const sections = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  return (
    <main className="privacy">
      <header>
        <h2>{t("header.title")}</h2>
        <p>
          {t("header.lastUpdate", { date: new Date().toLocaleDateString() })}
        </p>
      </header>

      {sections.map((key) => {
        const section = t(`sections.${key}`, { returnObjects: true }) as {
          title: string;
          p1?: string;
          p2?: string;
          li?: string[];
        };

        return (
          <section key={key}>
            <h3>{section.title}</h3>

            {section.p1 && (
              <p>{section.p1.replace("{{email}}", CONTACT_EMAIL)}</p>
            )}
            {section.p2 && (
              <p>{section.p2.replace("{{email}}", CONTACT_EMAIL)}</p>
            )}

            {section.li && (
              <ul>
                {section.li.map((item, idx) => (
                  <li key={idx}>{item.replace("{{email}}", CONTACT_EMAIL)}</li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </main>
  );
}
