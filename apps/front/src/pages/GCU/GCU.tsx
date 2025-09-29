import { useTranslation } from "react-i18next";
import "./GCU.scss";

export default function GCU() {
  const { t } = useTranslation("gcu");

  return (
    <div className="gcu">
      <header>
        <h2>{t("header.title")}</h2>
        <p>
          {t("header.lastUpdate", {
            date: new Date().toLocaleDateString(),
          })}
        </p>
      </header>

      <section>
        <h3>{t("sections.1.title")}</h3>
        <p>{t("sections.1.p1", { site: "https://www.dofusgroup.net" })}</p>
        <p>{t("sections.1.p2")}</p>
        <p>{t("sections.1.p3")}</p>
      </section>

      <section>
        <h3>{t("sections.2.title")}</h3>
        <p>{t("sections.2.p1")}</p>
        <p>{t("sections.2.p2")}</p>
      </section>

      <section>
        <h3>{t("sections.3.title")}</h3>
        <p>{t("sections.3.p1")}</p>
        <p>{t("sections.3.p2")}</p>
      </section>

      <section>
        <h3>{t("sections.4.title")}</h3>

        <h4>{t("sections.4.subsections.4.1.title")}</h4>
        <ul>
          {(
            t("sections.4.subsections.4.1.li", {
              returnObjects: true,
            }) as string[]
          ).map((item: string, idx: number) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <h4>{t("sections.4.subsections.4.2.title")}</h4>
        <ul>
          {(
            t("sections.4.subsections.4.2.li", {
              returnObjects: true,
            }) as string[]
          ).map((item: string, idx: number) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <h4>{t("sections.4.subsections.4.3.title")}</h4>
        <p>{t("sections.4.subsections.4.3.p")}</p>
      </section>

      <section>
        <h3>{t("sections.5.title")}</h3>
        <ul>
          {(t("sections.5.li", { returnObjects: true }) as string[]).map(
            (item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ),
          )}
        </ul>
        <p>{t("sections.5.p")}</p>
      </section>

      <section>
        <h3>{t("sections.6.title")}</h3>
        <ul>
          {(t("sections.6.li", { returnObjects: true }) as string[]).map(
            (item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ),
          )}
        </ul>
      </section>

      <section>
        <h3>{t("sections.7.title")}</h3>
        <p>{t("sections.7.p1")}</p>
        <p>{t("sections.7.p2")}</p>
        <p>{t("sections.7.p3")}</p>
        <p>{t("sections.7.p4")}</p>
      </section>

      <section>
        <h3>{t("sections.8.title")}</h3>
        <ul>
          {(t("sections.8.li", { returnObjects: true }) as string[]).map(
            (item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ),
          )}
        </ul>
      </section>

      <section>
        <h3>{t("sections.9.title")}</h3>
        <p>{t("sections.9.p1")}</p>
        <ul>
          {(t("sections.9.li", { returnObjects: true }) as string[]).map(
            (item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ),
          )}
        </ul>
        <p>{t("sections.9.p2")}</p>
      </section>

      <section>
        <h3>{t("sections.10.title")}</h3>
        <ul>
          {(t("sections.10.li", { returnObjects: true }) as string[]).map(
            (item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ),
          )}
        </ul>
      </section>

      <section>
        <h3>{t("sections.11.title")}</h3>
        <p>{t("sections.11.p")}</p>
      </section>

      <section>
        <h3>{t("sections.12.title")}</h3>
        <p>{t("sections.12.p")}</p>
      </section>

      <section>
        <h3>{t("sections.13.title")}</h3>
        <p>{t("sections.13.p")}</p>
      </section>

      <section>
        <h3>{t("sections.14.title")}</h3>
        <p>{t("sections.14.p")}</p>
      </section>
    </div>
  );
}
