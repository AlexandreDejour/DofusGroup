import "./About.scss";

import { useTranslation, Trans } from "react-i18next";

export default function About() {
  const { t } = useTranslation("about");

  return (
    <main className="about">
      <header>
        <h2>{t("header.title")}</h2>
        <p className="lead">{t("header.lead")}</p>
      </header>

      {["1", "2", "3", "4", "5"].map((sectionKey) => {
        const section = t(`sections.${sectionKey}`, {
          returnObjects: true,
        }) as {
          title: string;
          p1?: string;
          p2?: string;
          p3?: string;
          li?: string[];
        };

        return (
          <section key={sectionKey}>
            <h3>{section.title}</h3>

            {section.p1 && <p>{section.p1}</p>}
            {section.p2 && <p>{section.p2}</p>}
            {section.p3 && <p>{section.p3}</p>}

            {section.li && (
              <ul>
                {section.li.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </main>
  );
}
