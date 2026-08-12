const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const {
    getExecutiveReport
} = require("./executiveReportService");

// ============================================================
// PDF EXPORT SERVICE
// ============================================================
//
// Presentation/export layer.
//
// This service does NOT calculate:
//
// - Revenue
// - Profit
// - Cash
// - Inventory
// - Risks
// - Decisions
// - Recommendations
// - Advisor intelligence
//
// It receives an Executive Report and renders it into PDF.
//
// The function accepts either:
//
// 1. telegramId
//    -> builds the Executive Report automatically
//
// OR
//
// 2. report object
//    -> uses the supplied report directly
//
// The second form makes the service easy to test without
// touching SQLite or requiring a real user account.
// ============================================================


// ============================================================
// HELPERS
// ============================================================

function safeNumber(value) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
}


function formatCurrency(value) {

    return `₦${safeNumber(value).toLocaleString(
        "en-NG",
        {
            maximumFractionDigits: 2
        }
    )}`;
}


function formatPercentage(value) {

    return `${safeNumber(value).toFixed(2)}%`;
}


function formatScore(value) {

    return `${safeNumber(value)}/100`;
}


function safeText(
    value,
    fallback = "N/A"
) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return fallback;
    }

    return String(value);
}


function ensureDirectory(
    directory
) {

    if (
        !fs.existsSync(directory)
    ) {

        fs.mkdirSync(
            directory,
            {
                recursive: true
            }
        );

    }

}


// ============================================================
// WRITE SECTION HEADER
// ============================================================

function writeSectionHeader(
    document,
    title
) {

    document
        .moveDown(0.6)
        .font("Helvetica-Bold")
        .fontSize(14)
        .text(
            title
        )
        .moveDown(0.25);

}


// ============================================================
// WRITE METRIC
// ============================================================

function writeMetric(
    document,
    label,
    value
) {

    document
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(
            safeText(label)
        );

    document
        .font("Helvetica")
        .fontSize(10)
        .text(
            safeText(value)
        )
        .moveDown(0.15);

}


// ============================================================
// WRITE LIST
// ============================================================

function writeList(
    document,
    items,
    fallback = "None"
) {

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        document
            .font("Helvetica")
            .fontSize(10)
            .text(
                fallback
            );

        return;
    }


    items.forEach(
        item => {

            if (
                typeof item === "object" &&
                item !== null
            ) {

                const title =
                    safeText(
                        item.title,
                        "Untitled"
                    );

                const priority =
                    safeText(
                        item.priority,
                        "N/A"
                    );

                const score =
                    item.score !== undefined
                        ? ` — Score: ${safeNumber(item.score)}`
                        : "";

                const type =
                    item.type !== undefined
                        ? ` [${safeText(item.type)}]`
                        : "";

                const severity =
                    item.severity !== undefined
                        ? ` — ${safeText(item.severity)}`
                        : "";

                const message =
                    item.message !== undefined
                        ? ` — ${safeText(item.message)}`
                        : "";

                document
                    .font("Helvetica")
                    .fontSize(10)
                    .text(
                        `• ${title}${type} (${priority})${severity}${score}${message}`
                    );

                return;
            }


            document
                .font("Helvetica")
                .fontSize(10)
                .text(
                    `• ${safeText(item)}`
                );

        }
    );

}


// ============================================================
// WRITE ADVISOR SECTION
// ============================================================

function writeAdvisor(
    document,
    advisor
) {

    const safeAdvisor =
        advisor &&
        typeof advisor === "object"
            ? advisor
            : {};


    writeMetric(
        document,
        "Business Status",
        safeText(
            safeAdvisor.businessStatus
        )
    );


    writeMetric(
        document,
        "Overall Priority",
        safeText(
            safeAdvisor.overallPriority
        )
    );


    writeMetric(
        document,
        "Headline",
        safeText(
            safeAdvisor.headline
        )
    );


    writeMetric(
        document,
        "Assessment",
        safeText(
            safeAdvisor.assessment
        )
    );


    writeMetric(
        document,
        "Confidence",
        formatPercentage(
            safeAdvisor.confidence
        )
    );


    writeSectionHeader(
        document,
        "Key Issues"
    );


    writeList(
        document,
        safeAdvisor.keyIssues,
        "No key issues identified."
    );


    writeSectionHeader(
        document,
        "Opportunities"
    );


    writeList(
        document,
        safeAdvisor.opportunities,
        "No opportunities identified."
    );


    writeSectionHeader(
        document,
        "Recommended Actions"
    );


    writeList(
        document,
        safeAdvisor.recommendedActions,
        "No recommended actions available."
    );

}


// ============================================================
// RESOLVE REPORT INPUT
// ============================================================
//
// Supports:
//
// exportExecutiveReportToPDF(
//     telegramId,
//     outputPath
// )
//
// and:
//
// exportExecutiveReportToPDF(
//     report,
//     outputPath
// )
//
// ============================================================

function resolveReport(
    reportOrTelegramId
) {

    // Already-built Executive Report.
    if (
        reportOrTelegramId &&
        typeof reportOrTelegramId === "object" &&
        !Array.isArray(reportOrTelegramId)
    ) {

        return reportOrTelegramId;
    }


    // Telegram ID.
    return getExecutiveReport(
        reportOrTelegramId
    );

}


// ============================================================
// EXPORT EXECUTIVE REPORT TO PDF
// ============================================================

async function exportExecutiveReportToPDF(
    reportOrTelegramId,
    outputPath
) {

    // ========================================================
    // GET EXECUTIVE REPORT
    // ========================================================

    const report =
        resolveReport(
            reportOrTelegramId
        );


    // ========================================================
    // VALIDATE REPORT
    // ========================================================

    if (
        !report ||
        typeof report !== "object"
    ) {

        throw new Error(
            "Unable to generate PDF: Executive Report is unavailable."
        );

    }


    // ========================================================
    // DEFAULT OUTPUT DIRECTORY
    // ========================================================

    const defaultDirectory =
        path.join(
            process.cwd(),
            "exports"
        );


    ensureDirectory(
        defaultDirectory
    );


    const identifier =
        typeof reportOrTelegramId === "object"
            ? "report"
            : String(reportOrTelegramId);


    const finalPath =
        outputPath ||
        path.join(
            defaultDirectory,
            `executive-report-${identifier}-${Date.now()}.pdf`
        );


    // ========================================================
    // ENSURE CUSTOM DIRECTORY EXISTS
    // ========================================================

    ensureDirectory(
        path.dirname(
            finalPath
        )
    );


    // ========================================================
    // CREATE PDF
    // ========================================================

    const document =
        new PDFDocument(
            {
                size: "A4",
                margin: 50,

                info: {

                    Title:
                        "AI CFO Executive Financial Report",

                    Author:
                        "AI CFO",

                    Subject:
                        "Executive Financial Intelligence Report"

                }
            }
        );


    const stream =
        fs.createWriteStream(
            finalPath
        );


    document.pipe(
        stream
    );


    // ========================================================
    // TITLE
    // ========================================================

    document
        .font("Helvetica-Bold")
        .fontSize(22)
        .text(
            "AI CFO"
        );


    document
        .font("Helvetica-Bold")
        .fontSize(16)
        .text(
            "Executive Financial Report"
        );


    document
        .font("Helvetica")
        .fontSize(9)
        .text(
            `Generated: ${new Date().toLocaleString("en-NG")}`
        );


    document
        .moveDown(0.5);


    // ========================================================
    // BUSINESS OVERVIEW
    // ========================================================

    writeSectionHeader(
        document,
        "BUSINESS OVERVIEW"
    );


    const dashboard =
        report.dashboard || {};


    const health =
        report.health || {};


    writeMetric(
        document,
        "Revenue",
        formatCurrency(
            dashboard.sales ??
            dashboard.revenue
        )
    );


    writeMetric(
        document,
        "Net Profit",
        formatCurrency(
            dashboard.netProfit
        )
    );


    writeMetric(
        document,
        "Business Health",
        safeText(
            health.status
        )
    );


    writeMetric(
        document,
        "Business Score",
        formatScore(
            health.score
        )
    );


    // ========================================================
    // KPI SUMMARY
    // ========================================================

    writeSectionHeader(
        document,
        "KPI SUMMARY"
    );


    const kpis =
        report.kpis || {};


    writeMetric(
        document,
        "Gross Margin",
        formatPercentage(
            kpis.grossMargin
        )
    );


    writeMetric(
        document,
        "Net Margin",
        formatPercentage(
            kpis.netMargin
        )
    );


    writeMetric(
        document,
        "Cash Position",
        formatCurrency(
            kpis.cashPosition
        )
    );


    // ========================================================
    // BUSINESS TRENDS
    // ========================================================

    writeSectionHeader(
        document,
        "BUSINESS TRENDS"
    );


    const trends =
        report.trends || {};


    writeMetric(
        document,
        "Today",
        formatPercentage(
            trends.daily?.growth
        )
    );


    writeMetric(
        document,
        "This Week",
        formatPercentage(
            trends.weekly?.growth
        )
    );


    writeMetric(
        document,
        "This Month",
        formatPercentage(
            trends.monthly?.growth
        )
    );


    // ========================================================
    // BUSINESS FORECAST
    // ========================================================

    writeSectionHeader(
        document,
        "BUSINESS FORECAST"
    );


    const forecast =
        report.forecast || {};


    const forecastRevenue =
        forecast.revenue || {};


    writeMetric(
        document,
        "Next 7 Days Revenue",
        formatCurrency(
            forecast.next7DaysRevenue ??
            forecastRevenue.next7Days
        )
    );


    writeMetric(
        document,
        "Next 30 Days Revenue",
        formatCurrency(
            forecast.next30DaysRevenue ??
            forecastRevenue.next30Days
        )
    );


    writeMetric(
        document,
        "Tomorrow Revenue",
        formatCurrency(
            forecastRevenue.tomorrow
        )
    );


    writeMetric(
        document,
        "Revenue Forecast Confidence",
        formatPercentage(
            forecastRevenue.confidence
        )
    );


    // ========================================================
    // PROFITABILITY
    // ========================================================

    writeSectionHeader(
        document,
        "PROFITABILITY"
    );


    const profitLoss =
        report.profitLoss || {};


    writeMetric(
        document,
        "Gross Profit",
        formatCurrency(
            profitLoss.grossProfit
        )
    );


    writeMetric(
        document,
        "Net Profit",
        formatCurrency(
            profitLoss.netProfit
        )
    );


    // ========================================================
    // CASH FLOW
    // ========================================================

    writeSectionHeader(
        document,
        "CASH FLOW"
    );


    const cashFlow =
        report.cashFlow || {};


    writeMetric(
        document,
        "Opening Cash",
        formatCurrency(
            cashFlow.openingCash
        )
    );


    writeMetric(
        document,
        "Closing Cash",
        formatCurrency(
            cashFlow.closingCash
        )
    );


    writeMetric(
        document,
        "Cash Position",
        formatCurrency(
            cashFlow.cashPosition ??
            cashFlow.closingCash
        )
    );


    writeMetric(
        document,
        "Net Cash Flow",
        formatCurrency(
            cashFlow.netCashFlow
        )
    );


    // ========================================================
    // RISKS
    // ========================================================

    writeSectionHeader(
        document,
        "RISKS"
    );


    writeList(
        document,
        report.risks,
        "No significant risks detected."
    );


    // ========================================================
    // DECISIONS
    // ========================================================

    writeSectionHeader(
        document,
        "DECISIONS"
    );


    writeList(
        document,
        report.decisions,
        "No immediate decisions identified."
    );


    // ========================================================
    // RECOMMENDATIONS
    // ========================================================

    writeSectionHeader(
        document,
        "RECOMMENDATIONS"
    );


    writeList(
        document,
        report.recommendations,
        "No recommendations available."
    );


    // ========================================================
    // ADVISOR INTELLIGENCE
    // ========================================================

    writeSectionHeader(
        document,
        "AI CFO ADVISOR"
    );


    writeAdvisor(
        document,
        report.advisor
    );


    // ========================================================
    // EXECUTIVE SUMMARY
    // ========================================================

    writeSectionHeader(
        document,
        "EXECUTIVE SUMMARY"
    );


    const executiveSummary =
        report.executiveSummary || {};


    writeMetric(
        document,
        "Headline",
        executiveSummary.headline
    );


    writeMetric(
        document,
        "Message",
        executiveSummary.message
    );


    writeMetric(
        document,
        "Status",
        executiveSummary.status
    );


    writeMetric(
        document,
        "Top Priority",
        executiveSummary.topPriority
    );


    // ========================================================
    // FOOTER
    // ========================================================

    document
        .moveDown(1)
        .font("Helvetica")
        .fontSize(8)
        .text(
            "AI CFO — Executive Financial Intelligence",
            {
                align: "center"
            }
        );


    document
        .font("Helvetica")
        .fontSize(8)
        .text(
            "This report is generated from the business intelligence available at the time of export.",
            {
                align: "center"
            }
        );


    // ========================================================
    // FINISH PDF
    // ========================================================

    document.end();


    // ========================================================
    // WAIT FOR PDF TO FINISH
    // ========================================================

    return new Promise(
        (
            resolve,
            reject
        ) => {

            stream.on(
                "finish",
                () => {

                    resolve(
                        finalPath
                    );

                }
            );


            stream.on(
                "error",
                reject
            );

        }
    );

}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    exportExecutiveReportToPDF

};