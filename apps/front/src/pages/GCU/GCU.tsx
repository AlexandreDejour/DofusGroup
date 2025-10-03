import "./GCU.scss";

import { useTranslation } from "react-i18next";

type ContentBlock =
  | { type: "p"; text: string }
  | { type: "li"; items: string[] };

type Subsection = {
  title?: string;
  content?: ContentBlock[];
};

type Section = {
  title: string;
  content?: ContentBlock[];
  subsections?: Record<string, Subsection>;
};

export default function GCU() {
  const { t } = useTranslation("gcu");

  const sectionKeys = [
    "1",
    "2",
    "3",
    "4",
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

      {sectionKeys.map((key) => {
        const section = t(`sections.${key}`, {
          returnObjects: true,
        }) as Section;

        return (
          <section key={key}>
            <h3>{section.title}</h3>

            {/* main block management */}
            {section.content &&
              section.content.map((block, idx) => {
                if (block.type === "p") return <p key={idx}>{block.text}</p>;
                if (block.type === "li")
                  return (
                    <ul key={idx}>
                      {block.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  );
                return null;
              })}

            {/* specific block management (block 4) */}
            {section.subsections &&
              Object.entries(section.subsections).map(
                ([subKey, subsection]) => (
                  <div key={subKey}>
                    {subsection.title && <h4>{subsection.title}</h4>}
                    {subsection.content &&
                      subsection.content.map((block, idx) => {
                        if (block.type === "p")
                          return <p key={idx}>{block.text}</p>;
                        if (block.type === "li")
                          return (
                            <ul key={idx}>
                              {block.items.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          );
                        return null;
                      })}
                  </div>
                ),
              )}
          </section>
        );
      })}
    </div>
  );
}
