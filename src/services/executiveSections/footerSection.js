// ==========================
// FOOTER SECTION
// ==========================
function buildFooterSection(report) {

    const generatedAt =
        report.generatedAt.toLocaleString("en-NG", {

            dateStyle: "medium",

            timeStyle: "short"

        });

    return `━━━━━━━━━━━━━━━━━━

📅 Generated

${generatedAt}

━━━━━━━━━━━━━━━━━━

🤖 AI CFO

Helping businesses make smarter financial decisions every day.

Have a productive business day! 🚀`;

}

module.exports = {

    buildFooterSection

};