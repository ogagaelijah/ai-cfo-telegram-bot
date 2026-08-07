// ==========================
// BUSINESS ALERTS SECTION
// ==========================
function buildAlertsSection(report) {

    const critical =
        report.alerts.filter(alert => alert.level === "HIGH");

    const warnings =
        report.alerts.filter(alert => alert.level === "MEDIUM");

    const info =
        report.alerts.filter(
            alert =>
                alert.level === "LOW" ||
                alert.level === "GOOD"
        );

    return `🚨 BUSINESS ALERTS

🔴 Critical (${critical.length})

${critical.length > 0
    ? critical.map(alert => `• ${alert.title}`).join("\n")
    : "No critical alerts"}

━━━━━━━━━━━━━━━━━━

🟡 Warnings (${warnings.length})

${warnings.length > 0
    ? warnings.map(alert => `• ${alert.title}`).join("\n")
    : "No warnings"}

━━━━━━━━━━━━━━━━━━

🔵 Information (${info.length})

${info.length > 0
    ? info.map(alert => `• ${alert.title}`).join("\n")
    : "No informational alerts"}`;

}

module.exports = {

    buildAlertsSection

};