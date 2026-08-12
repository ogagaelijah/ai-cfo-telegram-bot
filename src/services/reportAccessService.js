const {
    requireAccount,
    requireAccountByUserId
} = require("./accountContext");

const {
    useFeature
} = require("./featureUsageService");

// ============================================================
// REPORT ACCESS SERVICE
// ============================================================
//
// INTERFACE-INDEPENDENT ACCESS CONTROL
//
// Architecture:
//
// Interface
//     ↓
// Identity
//     ↓
// Account Context
//     ↓
// Account Subscription
//     ↓
// REPORTS entitlement
//     ↓
// Usage limit
//
// The subscription and usage systems operate ONLY on accountId.
//
// Telegram, Website, Mobile, API, etc. are merely identity
// adapters.
//
// IMPORTANT:
//
// Opening the Reports Center does NOT consume usage.
//
// Calling an actual report consumes one REPORTS usage when
// the feature is allowed.
//
// ============================================================

const FEATURE_CODE = "REPORTS";

// ============================================================
// USE REPORT ACCESS BY ACCOUNT ID
// ============================================================
//
// CORE FUNCTION
//
// This is the actual business-logic entry point.
//
// It knows nothing about:
// - Telegram
// - Website
// - Mobile
// - WhatsApp
// - API
//
// It only knows the ACCOUNT.
//
// ============================================================

function useReportAccessByAccountId(accountId) {

    if (
        accountId === undefined ||
        accountId === null ||
        accountId === ""
    ) {

        throw new Error(
            "Account ID is required."
        );

    }

    return useFeature(
        accountId,
        FEATURE_CODE
    );
}

// ============================================================
// USE REPORT ACCESS BY USER ID
// ============================================================
//
// INTERFACE-INDEPENDENT USER ENTRY POINT
//
// Any authenticated interface that already knows the internal
// CFO user ID can use this function.
//
// Examples:
//
// Website
// Mobile App
// API
// Future interfaces
//
// ============================================================

function useReportAccessByUserId(userId) {

    if (
        userId === undefined ||
        userId === null ||
        userId === ""
    ) {

        throw new Error(
            "User ID is required."
        );

    }

    const account =
        requireAccountByUserId(
            userId
        );

    return useReportAccessByAccountId(
        account.accountId
    );
}

// ============================================================
// USE REPORT ACCESS BY TELEGRAM ID
// ============================================================
//
// TELEGRAM INTERFACE ADAPTER
//
// Telegram is only responsible for translating its external
// identity into the internal account context.
//
// The actual report access logic remains account-based.
//
// ============================================================

function useReportAccess(telegramId) {

    if (
        telegramId === undefined ||
        telegramId === null ||
        telegramId === ""
    ) {

        throw new Error(
            "Telegram user ID is required."
        );

    }

    const account =
        requireAccount(
            telegramId
        );

    return useReportAccessByAccountId(
        account.accountId
    );
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    useReportAccessByAccountId,

    useReportAccessByUserId,

    useReportAccess

};