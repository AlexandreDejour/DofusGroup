import { useTranslation } from "react-i18next";
import "./GCU.scss";

export default function GCU() {
  const { t } = useTranslation("gcu");

  const sectionKeys = [
    "1",
    "2",
    "3",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
  ];

  return (
    <div className="gcu">
      <header>
        <h2>{t("header.title")}</h2>
        <p>
          {t("header.lastUpdate", { date: new Date().toLocaleDateString() })}
        </p>
      </header>

      {/* Simple sections */}
      {sectionKeys.map((key) => {
        const section = t(`sections.${key}`, { returnObjects: true }) as {
          title: string;
          p1?: string;
          p2?: string;
          p3?: string;
          li?: string[];
        };

        return (
          <section key={key}>
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

      {/* Specific management for section 4 */}
      <section>
        <h3>{t("sections.4.title")}</h3>
        {["4.1", "4.2", "4.3"].map((subKey) => {
          const subsection = t(`sections.4.subsections.${subKey}`, {
            returnObjects: true,
          }) as {
            title?: string;
            p?: string;
            li?: string[];
          };

          return (
            <div key={subKey}>
              {subsection.title && <h4>{subsection.title}</h4>}
              {subsection.p && <p>{subsection.p}</p>}
              {subsection.li && (
                <ul>
                  {subsection.li.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
