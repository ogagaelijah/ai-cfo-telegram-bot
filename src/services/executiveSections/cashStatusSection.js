// ==========================
// CASH STATUS SECTION
// ==========================
function buildCashStatusSection(report) {

    const cashPosition = report.cash.cashPosition;

    let status = "🟢 Healthy";
    let summary = "Your business currently has a healthy cash position.";

    if (cashPosition < 0) {

        status = "🔴 Needs Immediate Attention";

        summary =
            "Cash outflows are exceeding inflows. Liquidity should be improved as soon as possible.";

    } else if (cashPosition < 50000) {

        status = "🟡 Monitor Closely";

        summary =
            "Cash reserves are becoming low. Monitor spending carefully.";

    }

    return `💵 CASH POSITION

Current Cash

₦${cashPosition.toLocaleString()}

Status

${status}

Assessment

${summary}`;

}

module.exports = {

    buildCashStatusSection

};