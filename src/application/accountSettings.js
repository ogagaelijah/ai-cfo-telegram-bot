const accountContext =
    require("../services/accountContext");

const accountSettingsService =
    require("../services/accountSettingsService");


// ======================================================
// ACCOUNT SETTINGS APPLICATION
// ======================================================
//
// Application orchestration layer.
//
// Responsibilities:
//
// - Resolve the current account
// - Validate account context
// - Enforce application-level authorization
// - Call account settings services
//
// This layer does NOT know about:
// - Telegram
// - ctx
// - keyboards
// - Telegram IDs
//
// Interface adapters should resolve the internal user ID
// and call these functions.
//
// ======================================================


// ======================================================
// GET CURRENT ACCOUNT SETTINGS
// ======================================================

function getCurrentAccountSettings(
    userId
) {

    const account =
        accountContext.requireAccountByUserId(
            userId
        );


    return accountSettingsService.getAccountSettings(
        account.accountId,
        userId
    );

}


// ======================================================
// UPDATE ACCOUNT NAME
// ======================================================
//
// Only OWNER and ADMIN may rename an account.
//
// The OWNER is the account owner.
//
// ======================================================

function updateAccountName(
    userId,
    name
) {

    const account =
        accountContext.requireAccountByUserId(
            userId
        );


    // ==================================================
    // AUTHORIZATION
    // ==================================================

    const allowedRoles = [

        "OWNER",
        "ADMIN"

    ];


    if (
        !allowedRoles.includes(
            account.role
        )
    ) {

        throw new Error(
            "You do not have permission to update account settings."
        );

    }


    return accountSettingsService.updateAccountName(
        account.accountId,
        name
    );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getCurrentAccountSettings,

    updateAccountName

};