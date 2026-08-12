const {
    getExecutiveReport
} = require("../services/executiveReportService");

const {
    useReportAccess
} = require("../services/reportAccessService");

// ============================================================
// REPORT APPLICATION SERVICE
// ============================================================
//
// Application boundary for executive financial reporting.
//
// Responsibilities:
//
// 1. Validate the requesting Telegram user.
// 2. Enforce REPORTS entitlement and usage.
// 3. Generate the Executive Report.
//
// IMPORTANT:
//
// The underlying Executive Report service remains
// interface-independent in its business logic.
//
// Telegram ID is currently the identity passed through
// the existing reporting architecture.
//
// ============================================================

// ============================================================
// GET EXECUTIVE REPORT FOR USER
// ============================================================

function getExecutiveReportForUser(
    telegramId,
    reportService = {
        getExecutiveReport
    },
    accessService = {
        useReportAccess
    }
) {

    // --------------------------------------------------------
    // VALIDATE TELEGRAM ID
    // --------------------------------------------------------

    if (
        telegramId === undefined ||
        telegramId === null ||
        telegramId === ""
    ) {

        throw new Error(
            "Telegram user ID is required."
        );

    }

    // --------------------------------------------------------
    // VALIDATE REPORT SERVICE
    // --------------------------------------------------------

    if (
        !reportService ||
        typeof reportService.getExecutiveReport !== "function"
    ) {

        throw new Error(
            "Executive report service is required."
        );

    }

    // --------------------------------------------------------
    // VALIDATE ACCESS SERVICE
    // --------------------------------------------------------

    if (
        !accessService ||
        typeof accessService.useReportAccess !== "function"
    ) {

        throw new Error(
            "Report access service is required."
        );

    }

    // --------------------------------------------------------
    // ENFORCE REPORT ACCESS
    // --------------------------------------------------------
    //
    // This checks:
    //
    // Telegram user
    //      ↓
    // Current account
    //      ↓
    // Subscription
    //      ↓
    // REPORTS entitlement
    //      ↓
    // Usage limit
    //
    // It consumes one REPORTS usage only when
    // the report is actually allowed.
    // --------------------------------------------------------

    const access =
        accessService.useReportAccess(
            telegramId
        );

    // --------------------------------------------------------
    // BLOCK WHEN NOT ALLOWED
    // --------------------------------------------------------

    if (
        !access ||
        access.allowed !== true
    ) {

        const error =
            new Error(
                "REPORT_ACCESS_DENIED"
            );

        error.code =
            "REPORT_ACCESS_DENIED";

        error.access =
            access;

        throw error;

    }

    // --------------------------------------------------------
    // GENERATE REPORT
    // --------------------------------------------------------

    return reportService.getExecutiveReport(
        telegramId
    );

}

// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getExecutiveReportForUser

};