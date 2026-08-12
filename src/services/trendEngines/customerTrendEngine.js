const customerRepository =
    require("../../repositories/customerRepository");

// ============================================================
// CUSTOMER TREND ENGINE
// ============================================================
//
// ACCOUNT-BASED TREND ENGINE
//
// Customer data belongs to an ACCOUNT.
//
// This engine receives accountId directly.
//
// It does NOT know about:
//
// - Telegram
// - Web
// - Mobile
// - HTTP
// - Sessions
// - Interface users
//
// ============================================================

function getCustomerTrend(accountId) {

    if (
        accountId === undefined ||
        accountId === null ||
        accountId === ""
    ) {

        throw new Error(
            "Account ID is required."
        );

    }


    const customers =
        customerRepository.findAll(
            accountId
        );


    const total =
        customers.length;


    let direction =
        "Stable";


    // ========================================================
    // CUSTOMER STATUS
    // ========================================================

    if (total === 0) {

        direction =
            "No Customers";

    }
    else if (total >= 10) {

        direction =
            "Growing";

    }


    return {

        total,

        direction

    };

}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    getCustomerTrend

};