import { NextRequest, NextResponse } from "next/server";
import { MOCK_SIGNALEMENTS, getCategoryById } from "@/lib/mock-data";
import { STATUS_LABELS, SEVERITY_LABELS } from "@signalicity/shared";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const format = searchParams.get("format") ?? "csv";
  const status = searchParams.get("status");
  const category = searchParams.get("category");

  // In production: query from Supabase with filters
  let signalements = MOCK_SIGNALEMENTS;
  if (status && status !== "all") {
    signalements = signalements.filter((s) => s.status === status);
  }
  if (category && category !== "all") {
    signalements = signalements.filter((s) => s.category_id === category);
  }

  if (format === "csv") {
    const headers = [
      "ID",
      "Date",
      "Titre",
      "Categorie",
      "Statut",
      "Gravite",
      "Adresse",
      "Latitude",
      "Longitude",
      "Description",
      "Date resolution",
    ];

    const rows = signalements.map((s) => [
      s.id,
      new Date(s.created_at).toLocaleDateString("fr-FR"),
      `"${s.title.replace(/"/g, '""')}"`,
      getCategoryById(s.category_id)?.name ?? "",
      STATUS_LABELS[s.status] ?? s.status,
      SEVERITY_LABELS[s.severity] ?? s.severity,
      `"${(s.address ?? "").replace(/"/g, '""')}"`,
      s.latitude,
      s.longitude,
      `"${s.description.replace(/"/g, '""')}"`,
      s.resolved_at
        ? new Date(s.resolved_at).toLocaleDateString("fr-FR")
        : "",
    ]);

    const bom = "\uFEFF";
    const csv =
      bom +
      [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=signalements_croissy_${new Date().toISOString().split("T")[0]}.csv`,
      },
    });
  }

  if (format === "pdf") {
    // Generate a simple HTML report that can be printed as PDF
    const total = signalements.length;
    const resolved = signalements.filter((s) => s.status === "resolved").length;
    const inProgress = signalements.filter(
      (s) => s.status === "in_progress"
    ).length;
    const received = signalements.filter(
      (s) => s.status === "received"
    ).length;

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapport Signalements - Croissy-sur-Seine</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; color: #111827; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    .subtitle { color: #6B7280; font-size: 14px; margin-bottom: 32px; }
    .stats { display: flex; gap: 16px; margin-bottom: 32px; }
    .stat { flex: 1; background: #F9FAFB; padding: 16px; border-radius: 12px; text-align: center; }
    .stat-value { font-size: 28px; font-weight: 700; }
    .stat-label { font-size: 12px; color: #6B7280; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #F9FAFB; padding: 10px 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #E5E7EB; }
    td { padding: 10px 12px; border-bottom: 1px solid #F3F4F6; }
    .footer { margin-top: 40px; text-align: center; color: #9CA3AF; font-size: 11px; }
  </style>
</head>
<body>
  <h1>Rapport des signalements</h1>
  <p class="subtitle">Croissy-sur-Seine - Genere le ${new Date().toLocaleDateString("fr-FR")}</p>

  <div class="stats">
    <div class="stat"><div class="stat-value">${total}</div><div class="stat-label">Total</div></div>
    <div class="stat"><div class="stat-value" style="color:#10B981">${resolved}</div><div class="stat-label">Resolus</div></div>
    <div class="stat"><div class="stat-value" style="color:#3B82F6">${inProgress}</div><div class="stat-label">En cours</div></div>
    <div class="stat"><div class="stat-value" style="color:#9CA3AF">${received}</div><div class="stat-label">Recus</div></div>
  </div>

  <table>
    <thead>
      <tr><th>Date</th><th>Titre</th><th>Categorie</th><th>Statut</th><th>Gravite</th><th>Adresse</th></tr>
    </thead>
    <tbody>
      ${signalements
        .map(
          (s) =>
            `<tr>
              <td>${new Date(s.created_at).toLocaleDateString("fr-FR")}</td>
              <td>${s.title}</td>
              <td>${getCategoryById(s.category_id)?.name ?? ""}</td>
              <td>${STATUS_LABELS[s.status] ?? s.status}</td>
              <td>${SEVERITY_LABELS[s.severity] ?? s.severity}</td>
              <td>${s.address ?? ""}</td>
            </tr>`
        )
        .join("")}
    </tbody>
  </table>

  <div class="footer">Signalicity - Plateforme de signalement municipal</div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename=rapport_signalements_${new Date().toISOString().split("T")[0]}.html`,
      },
    });
  }

  return NextResponse.json({ error: "Format non supporte" }, { status: 400 });
}
