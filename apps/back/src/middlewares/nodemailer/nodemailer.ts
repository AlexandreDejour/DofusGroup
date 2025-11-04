import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

import { Config } from "../../config/config.js";

export class MailService {
  private config: Config;
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.config = Config.getInstance();

    this.transporter = nodemailer.createTransport({
      host: "smtp",
      port: this.config.environment === "development" ? 587 : 465,
      secure: this.config.environment !== "development",
      auth: {
        user: this.config.smtpUser,
        pass: this.config.smtpPassword,
      },
      tls: {
        // ⚡ ignore auto signed certs in dev
        rejectUnauthorized: this.config.environment !== "development",
      },
    });
  }

  public async sendVerificationMail(
    to: string,
    language: string,
    token: string,
  ) {
    const templates: Record<string, { subject: string; html: string }> = {
      fr: {
        subject: "Vérifie ton email",
        html: `<p>Bienvenue sur DofusGroup! Clique <a href="https://dofusgroup.fr/verify_email?token=${token}">ici</a> pour vérifier ton email.</p>`,
      },
      en: {
        subject: "Verify your email",
        html: `<p>Welcome on DofusGroup! Click <a href="https://dofusgroup.fr/verify_email?token=${token}">ici</a> to verify your email.</p>`,
      },
    };

    const { subject, html } = templates[language] || templates["fr"];

    return this.transporter.sendMail({
      from: "DofusGroup <no-reply@dofusgroup.fr>",
      to,
      subject,
      html,
    });
  }
}
