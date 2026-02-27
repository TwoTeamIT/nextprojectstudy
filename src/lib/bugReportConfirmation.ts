// lib/emails/bugReportConfirmation.ts

export interface BugReportEmailData {
  username: string;
  issueKey: string;
  issueTitle: string;
  priority: string;
}

export function buildBugReportEmail(data: BugReportEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const { username, issueKey, issueTitle, priority } = data;

  const subject = `[${issueKey}] Bug report received / Segnalazione ricevuta`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background-color: #1a1a2e; padding: 32px 40px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 600; letter-spacing: 0.5px; }
    .header span { color: #e74c3c; }
    .badge { display: inline-block; background: #e74c3c; color: #fff; font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: 4px; margin-top: 10px; letter-spacing: 1px; }
    .section { padding: 32px 40px; }
    .section + .section { border-top: 1px solid #e8e8e8; }
    .lang-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #999; margin-bottom: 16px; }
    h2 { margin: 0 0 16px; font-size: 17px; color: #1a1a2e; }
    p { margin: 0 0 12px; font-size: 15px; line-height: 1.6; color: #444; }
    p:last-child { margin-bottom: 0; }
    .issue-box { background: #f8f8fa; border-left: 4px solid #e74c3c; border-radius: 4px; padding: 16px 20px; margin: 20px 0; }
    .issue-box .key { font-size: 13px; font-weight: 700; color: #e74c3c; letter-spacing: 1px; margin-bottom: 4px; }
    .issue-box .title { font-size: 15px; color: #1a1a2e; font-weight: 600; }
    .issue-box .meta { font-size: 13px; color: #888; margin-top: 6px; }
    .footer { background: #f4f4f5; padding: 20px 40px; text-align: center; }
    .footer p { font-size: 12px; color: #aaa; margin: 0; }
  </style>
</head>
<body>
  <div class="wrapper">

    <!-- Header -->
    <div class="header">
      <h1>Two<span>Team</span> Support</h1>
      <div class="badge">${issueKey}</div>
    </div>

    <!-- English section -->
    <div class="section">
      <div class="lang-label">🇬🇧 English</div>
      <h2>Hi ${username}, we received your report!</h2>
      <p>
        Thank you for taking the time to report this issue. Our team has been notified
        and will look into it as soon as possible.
      </p>
      <div class="issue-box">
        <div class="key">${issueKey}</div>
        <div class="title">${issueTitle}</div>
        <div class="meta">Priority: ${priority}</div>
      </div>
      <p>
        Please keep this email as a reference. If you have additional information to add,
        reply to this email quoting the issue code <strong>${issueKey}</strong>.
      </p>
    </div>

    <!-- Italian section -->
    <div class="section">
      <div class="lang-label">🇮🇹 Italiano</div>
      <h2>Ciao ${username}, abbiamo ricevuto la tua segnalazione!</h2>
      <p>
        Grazie per aver dedicato il tempo a segnalare questo problema. Il nostro team
        è stato avvisato e lo prenderà in carico il prima possibile.
      </p>
      <div class="issue-box">
        <div class="key">${issueKey}</div>
        <div class="title">${issueTitle}</div>
        <div class="meta">Priorità: ${priority}</div>
      </div>
      <p>
        Conserva questa email come riferimento. Se hai ulteriori informazioni da aggiungere,
        rispondi a questa email citando il codice <strong>${issueKey}</strong>.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>TwoTeam · support@twoteam.it</p>
      <p style="margin-top:4px;">This is an automated message / Messaggio automatico</p>
    </div>

  </div>
</body>
</html>`;

  // Plain text fallback
  const text = `
[${issueKey}] Bug report received / Segnalazione ricevuta

────────────────────────────────
🇬🇧 ENGLISH
────────────────────────────────
Hi ${username},

Thank you for reporting this issue. Our team has been notified and will look into it as soon as possible.

Issue:    ${issueKey} — ${issueTitle}
Priority: ${priority}

If you have additional information, reply to this email quoting ${issueKey}.

────────────────────────────────
🇮🇹 ITALIANO
────────────────────────────────
Ciao ${username},

Grazie per aver segnalato questo problema. Il nostro team è stato avvisato e lo prenderà in carico il prima possibile.

Ticket:   ${issueKey} — ${issueTitle}
Priorità: ${priority}

Se hai ulteriori informazioni, rispondi a questa email citando il codice ${issueKey}.

────────────────────────────────
TwoTeam · support@twoteam.it
`.trim();

  return { subject, html, text };
}
