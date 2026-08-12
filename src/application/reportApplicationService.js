const {
    getExecutiveReport
} = require("../services/executiveReportService");

// ============================================================
// REPORT APPLICATION SERVICE
// ============================================================
//
// Application layer.
//
// This is the interface-independent entry point for
// executive financial reporting.
//
// The application layer does not calculate financial
// intelligence. It delegates to the Executive Report service.
//
// The report service can also be injected when testing.
// This keeps the application boundary independent from
// SQLite and the underlying financial intelligence engine.
// ============================================================

// ============================================================
// GET EXECUTIVE REPORT
// ============================================================

function getExecutiveReportForUser(
    userId,
    reportService = {
        getExecutiveReport
    }
) {

    if (
        userId === undefined ||
        userId === null ||
        userId === ""
    ) {

        throw new Error(
            "User ID is required."
        );

    }


    if (
        !reportService ||
        typeof reportService.getExecutiveReport !== "function"
    ) {

        throw new Error(
            "Executive report service is required."
        );

    }


    return reportService.getExecutiveReport(
        userId
    );

}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getExecutiveReportForUser

};