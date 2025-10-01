import "./About.scss";

import { useTranslation, Trans } from "react-i18next";

type ContentBlock =
  | { type: "p"; text: string }
  | { type: "li"; items: string[] };

type Section = {
  title: string;
  content?: ContentBlock[];
};

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
        }) as Section;

        return (
          <section key={sectionKey}>
            <h3>{section.title}</h3>

            {section.content?.map((block, idx) => {
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
          </section>
        );
      })}
    </main>
  );
}
