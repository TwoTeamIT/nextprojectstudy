import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { buildBugReportEmail } from "@/lib/bugReportConfirmation";
import { JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEY, SUPPORT_EMAIL, RESEND_API_KEY, APP_NAME } from "@/configs";


const resend = new Resend(RESEND_API_KEY);

const authHeader = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");

const jiraFetch = (path: string, options: RequestInit) =>
  fetch(`${JIRA_BASE_URL}/rest/api/3${path}`, {
    ...options,
    headers: {
      Authorization: `Basic ${authHeader}`,
      Accept: "application/json",
      ...(options.headers ?? {}),
    },
  });

// Map UI priority labels to Jira priority names
const PRIORITY_MAP: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Highest",
};

// Human-readable priority labels for the confirmation email (bilingual)
const PRIORITY_LABEL: Record<string, string> = {
  low: "Low / Bassa",
  medium: "Medium / Media",
  high: "High / Alta",
  critical: "Critical / Critica",
};

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const pageUrl = formData.get("pageUrl") as string;
    const userAgent = formData.get("userAgent") as string;
    const userId = formData.get("userId") as string | null;
    const userEmail = formData.get("userEmail") as string | null;
    const username = formData.get("username") as string | null;
    const stepsToReproduce = formData.get("stepsToReproduce") as string | null;
    const environment = formData.get("environment") as string | null;
    const appVersion = formData.get("appVersion") as string | null;
    const referenceEmail = formData.get("referenceEmail") as string | null;
    const screenshot = formData.get("screenshot") as File | null;

    if (!title || !description || !priority) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Prefix the title with the app name if configured
    // Result: "[MyApp] Original title"
    const summary = APP_NAME ? `[${APP_NAME}] ${title}` : title;

    // 1. Build ADF description for Jira
    const adfDescription = buildADF(description, {
      stepsToReproduce,
      pageUrl,
      userAgent,
      userId,
      userEmail,
      username,
      environment,
      appVersion,
      referenceEmail,
    });

    // 2. Create the Jira issue
    const issueRes = await jiraFetch("/issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          project: { key: JIRA_PROJECT_KEY },
          summary,
          description: adfDescription,
          issuetype: { name: "Bug" },
          priority: { name: PRIORITY_MAP[priority] ?? "Medium" },
        },
      }),
    });

    if (!issueRes.ok) {
      const error = await issueRes.json();
      console.error("Jira create issue error:", error);
      return NextResponse.json({ error: "Failed to create Jira issue" }, { status: 502 });
    }

    const issue = await issueRes.json();
    const issueKey: string = issue.key;
    const issueId: string = issue.id;

    // 3. Attach screenshot if provided (non-fatal)
    if (screenshot) {
      const attachFormData = new FormData();
      attachFormData.append("file", screenshot, screenshot.name);

      const attachRes = await jiraFetch(`/issue/${issueId}/attachments`, {
        method: "POST",
        headers: { "X-Atlassian-Token": "no-check" },
        body: attachFormData,
      });

      if (!attachRes.ok) {
        console.warn("Failed to attach screenshot to", issueKey);
      }
    }

    // 4. Send confirmation email (non-fatal)
    // Use referenceEmail if provided, otherwise fall back to the logged-in user email
    const emailRecipient = referenceEmail || userEmail;
    if (emailRecipient) {
      const { subject, html, text } = buildBugReportEmail({
        username: username ?? emailRecipient,
        issueKey,
        issueTitle: title, // original title without prefix in the email
        priority: PRIORITY_LABEL[priority] ?? priority,
      });

      const emailResult = await resend.emails.send({
        from: `TwoTeam Support <${SUPPORT_EMAIL}>`,
        to: emailRecipient,
        bcc: SUPPORT_EMAIL, // CCN a support@twoteam.it
        subject,
        html,
        text, // plain-text fallback
      });

      if (emailResult.error) {
        // Non-fatal: il ticket è stato creato, logghiamo solo l'errore
        console.warn("Failed to send confirmation email:", emailResult.error);
      }
    }

    return NextResponse.json({ success: true, issueKey });
  } catch (err) {
    console.error("Unexpected error in create-issue route:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface DebugInfo {
  stepsToReproduce: string | null;
  pageUrl: string;
  userAgent: string;
  userId: string | null;
  userEmail: string | null;
  username: string | null;
  environment: string | null;
  appVersion: string | null;
  referenceEmail: string | null;
}

function textNode(text: string) {
  return { type: "paragraph", content: [{ type: "text", text }] };
}

function boldCell(text: string) {
  return {
    type: "tableCell",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text, marks: [{ type: "strong" }] }],
      },
    ],
  };
}

function valueCell(text: string) {
  return {
    type: "tableCell",
    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
  };
}

function tableRow(label: string, value: string | null) {
  return { type: "tableRow", content: [boldCell(label), valueCell(value ?? "—")] };
}

function buildADF(userDescription: string, debug: DebugInfo) {
  const content: object[] = [];

  // ── User description ──
  content.push(textNode(userDescription));

  // ── Steps to reproduce (if provided) ──
  if (debug.stepsToReproduce) {
    content.push({ type: "rule" });
    content.push({
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "🪜 Steps to Reproduce" }],
    });
    content.push(textNode(debug.stepsToReproduce));
  }

  // ── Debug info table ──
  const debugRows = [
    ["Environment", debug.environment],
    ["App Version", debug.appVersion || null],
    ["Page URL", debug.pageUrl],
    ["User Agent", debug.userAgent],
    ...(debug.username ? [["Username", debug.username]] : []),
    ...(debug.userId ? [["User ID", debug.userId]] : []),
    ...(debug.userEmail ? [["User Email", debug.userEmail]] : []),
    ...(debug.referenceEmail ? [["Reference Email", debug.referenceEmail]] : []),
    ["Timestamp", new Date().toISOString()],
  ] as [string, string | null][];

  content.push({ type: "rule" });
  content.push({
    type: "heading",
    attrs: { level: 3 },
    content: [{ type: "text", text: "🔍 Debug Info" }],
  });
  content.push({
    type: "table",
    attrs: { isNumberColumnEnabled: false, layout: "default" },
    content: debugRows.map(([label, value]) => tableRow(label, value)),
  });

  return { version: 1, type: "doc", content };
}