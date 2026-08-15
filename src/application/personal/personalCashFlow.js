const personalCashFlowService =
    require("../../services/personal/personalCashFlowService");


// ======================================================
// PERSONAL CASH FLOW APPLICATION
// ======================================================
//
// INTERFACE-NEUTRAL APPLICATION LAYER
//
// This file does NOT know about:
//
// - Telegram
// - ctx
// - telegramId
// - keyboards
// - sessions
// - HTTP
// - mobile apps
//
// The caller provides accountId.
//
// Architecture:
//
// Interface
//     ↓
// Application
//     ↓
// Service
//     ↓
// Repository
//     ↓
// Database
//
// ======================================================


// ======================================================
// TODAY
// ======================================================

function getTodayPersonalCashFlow(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return personalCashFlowService
        .getTodayCashFlow(
            accountId
        );

}


// ======================================================
// CURRENT WEEK
// ======================================================

function getCurrentWeekPersonalCashFlow(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return personalCashFlowService
        .getCurrentWeekCashFlow(
            accountId
        );

}


// ======================================================
// CURRENT MONTH
// ======================================================

function getCurrentMonthPersonalCashFlow(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return personalCashFlowService
        .getCurrentMonthCashFlow(
            accountId
        );

}


// ======================================================
// CURRENT YEAR
// ======================================================

function getCurrentYearPersonalCashFlow(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return personalCashFlowService
        .getCurrentYearCashFlow(
            accountId
        );

}


// ======================================================
// ALL TIME
// ======================================================

function getAllTimePersonalCashFlow(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return personalCashFlowService
        .getAllTimeCashFlow(
            accountId
        );

}


// ======================================================
// WEEKLY INFLOWS
// ======================================================

function getWeeklyPersonalInflows(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return personalCashFlowService
        .getWeeklyInflows(
            accountId
        );

}


// ======================================================
// MONTHLY INFLOWS
// ======================================================

function getMonthlyPersonalInflows(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return personalCashFlowService
        .getMonthlyInflows(
            accountId
        );

}


// ======================================================
// YEARLY INFLOWS
// ======================================================

function getYearlyPersonalInflows(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return personalCashFlowService
        .getYearlyInflows(
            accountId
        );

}


// ======================================================
// WEEKLY OUTFLOWS
// ======================================================

function getWeeklyPersonalOutflows(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return personalCashFlowService
        .getWeeklyOutflows(
            accountId
        );

}


// ======================================================
// MONTHLY OUTFLOWS
// ======================================================

function getMonthlyPersonalOutflows(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return personalCashFlowService
        .getMonthlyOutflows(
            accountId
        );

}


// ======================================================
// YEARLY OUTFLOWS
// ======================================================

function getYearlyPersonalOutflows(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return personalCashFlowService
        .getYearlyOutflows(
            accountId
        );

}


// ======================================================
// WEEKLY NET CASH FLOW
// ======================================================

function getWeeklyPersonalNetCashFlow(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return personalCashFlowService
        .getWeeklyNetCashFlow(
            accountId
        );

}


// ======================================================
// MONTHLY NET CASH FLOW
// ======================================================

function getMonthlyPersonalNetCashFlow(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return personalCashFlowService
        .getMonthlyNetCashFlow(
            accountId
        );

}


// ======================================================
// YEARLY NET CASH FLOW
// ======================================================

function getYearlyPersonalNetCashFlow(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return personalCashFlowService
        .getYearlyNetCashFlow(
            accountId
        );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getTodayPersonalCashFlow,

    getCurrentWeekPersonalCashFlow,

    getCurrentMonthPersonalCashFlow,

    getCurrentYearPersonalCashFlow,

    getAllTimePersonalCashFlow,

    getWeeklyPersonalInflows,

    getMonthlyPersonalInflows,

    getYearlyPersonalInflows,

    getWeeklyPersonalOutflows,

    getMonthlyPersonalOutflows,

    getYearlyPersonalOutflows,

    getWeeklyPersonalNetCashFlow,

    getMonthlyPersonalNetCashFlow,

    getYearlyPersonalNetCashFlow

};