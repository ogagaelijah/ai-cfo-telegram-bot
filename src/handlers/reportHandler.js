const reportKeyboard =
    require("../keyboards/reportKeyboard");

const reportFlow =
    require("../flows/reportFlow");

const forecastFlow =
    require("../flows/forecastFlow");

const kpiFlow =
    require("../flows/kpiFlow");

const businessTrendsFlow =
    require("../flows/businessTrendsFlow");

const profitLossFlow =
    require("../flows/profitLossFlow");

const cashFlowFlow =
    require("../flows/cashFlowFlow");

const inventoryReportFlow =
    require("../flows/inventoryReportFlow");

const debtorsReportFlow =
    require("../flows/debtorsReportFlow");

const creditorsReportFlow =
    require("../flows/creditorsReportFlow");

const executiveReportFlow =
    require("../flows/executiveReportFlow");

const periodReportFlow =
    require("../flows/periodReportFlow");

const aiInsightsFlow =
    require("../flows/aiInsightsFlow");


const {
    exportExecutiveReportToPDF
} = require("../services/pdfExportService");


const {
    exportExecutiveReportToExcel
} = require("../services/excelExportService");


// ==================================================
// REPORT HANDLER
// ==================================================

module.exports = async function reportHandler(ctx) {

    const text =
        ctx.message.text;


    // ==================================================
    // REPORT MENU
    // ==================================================

    if (
        text === "📊 Reports"
    ) {

        await ctx.reply(
            "📊 REPORTS CENTER",
            reportKeyboard
        );

        return true;
    }


    // ==================================================
    // EXECUTIVE DASHBOARD
    // ==================================================

    if (
        text === "📊 Executive Dashboard"
    ) {

        await reportFlow(ctx);

        return true;
    }


    // ==================================================
    // BUSINESS FORECAST
    // ==================================================

    if (
        text === "📈 Business Forecast"
    ) {

        await forecastFlow(ctx);

        return true;
    }


    // ==================================================
    // KPI DASHBOARD
    // ==================================================

    if (
        text === "📊 KPI Dashboard"
    ) {

        await kpiFlow(ctx);

        return true;
    }


    // ==================================================
    // BUSINESS TRENDS
    // ==================================================

    if (
        text === "📉 Business Trends"
    ) {

        await businessTrendsFlow(ctx);

        return true;
    }


    // ==================================================
    // DAILY REPORT
    // ==================================================

    if (
        text === "📅 Daily Report"
    ) {

        await periodReportFlow(
            ctx,
            "daily"
        );

        return true;
    }


    // ==================================================
    // WEEKLY REPORT
    // ==================================================

    if (
        text === "📅 Weekly Report" ||
        text === "📆 Weekly Report"
    ) {

        await periodReportFlow(
            ctx,
            "weekly"
        );

        return true;
    }


    // ==================================================
    // MONTHLY REPORT
    // ==================================================

    if (
        text === "🗓 Monthly Report" ||
        text === "📆 Monthly Report"
    ) {

        await periodReportFlow(
            ctx,
            "monthly"
        );

        return true;
    }


    // ==================================================
    // EXECUTIVE REPORT
    // ==================================================

    if (
        text === "📑 Executive Report"
    ) {

        await executiveReportFlow(ctx);

        return true;
    }


    // ==================================================
    // PROFIT & LOSS
    // ==================================================

    if (
        text === "💰 Profit & Loss"
    ) {

        await profitLossFlow(ctx);

        return true;
    }


    // ==================================================
    // CASH FLOW
    // ==================================================

    if (
        text === "💵 Cash Flow"
    ) {

        await cashFlowFlow(ctx);

        return true;
    }


    // ==================================================
    // INVENTORY REPORT
    // ==================================================

    if (
        text === "📦 Inventory Report"
    ) {

        await inventoryReportFlow(ctx);

        return true;
    }


    // ==================================================
    // DEBTORS REPORT
    // ==================================================

    if (
        text === "👥 Debtors Report"
    ) {

        await debtorsReportFlow(ctx);

        return true;
    }


    // ==================================================
    // CREDITORS REPORT
    // ==================================================

    if (
        text === "🏢 Creditors Report"
    ) {

        await creditorsReportFlow(ctx);

        return true;
    }


    // ==================================================
    // AI INSIGHTS
    // ==================================================

    if (
        text === "🤖 AI Insights"
    ) {

        await aiInsightsFlow(ctx);

        return true;
    }


    // ==================================================
    // EXPORT PDF
    // ==================================================

    if (
        text === "📄 Export PDF"
    ) {

        try {

            await ctx.reply(
                "📄 Generating your Executive Financial Report PDF...\n\nPlease wait."
            );


            const pdfPath =
                await exportExecutiveReportToPDF(
                    ctx.from.id
                );


            if (!pdfPath) {

                await ctx.reply(
                    "❌ Unable to generate the PDF report."
                );

                return true;
            }


            await ctx.replyWithDocument(
                {
                    source: pdfPath
                },
                {
                    caption:
                        "📄 AI CFO Executive Financial Report"
                }
            );


        } catch (error) {

            console.error(
                "❌ PDF EXPORT ERROR:",
                error
            );


            await ctx.reply(
                "❌ Something went wrong while generating the PDF report.\n\nPlease try again."
            );

        }


        return true;
    }


    // ==================================================
    // EXPORT EXCEL
    // ==================================================

    if (
        text === "📊 Export Excel"
    ) {

        try {

            await ctx.reply(
                "📊 Generating your Executive Financial Report Excel file...\n\nPlease wait."
            );


            const excelPath =
                await exportExecutiveReportToExcel(
                    ctx.from.id
                );


            if (!excelPath) {

                await ctx.reply(
                    "❌ Unable to generate the Excel report."
                );

                return true;
            }


            await ctx.replyWithDocument(
                {
                    source: excelPath
                },
                {
                    caption:
                        "📊 AI CFO Executive Financial Report — Excel"
                }
            );


        } catch (error) {

            console.error(
                "❌ EXCEL EXPORT ERROR:",
                error
            );


            await ctx.reply(
                "❌ Something went wrong while generating the Excel report.\n\nPlease try again."
            );

        }


        return true;
    }


    // ==================================================
    // NOT A REPORT COMMAND
    // ==================================================

    return false;

};