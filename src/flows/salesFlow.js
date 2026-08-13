const keyboard = require("../keyboards/mainKeyboard");
const paymentKeyboard = require("../keyboards/paymentKeyboard");

const {
getSession,
setSession,
clearSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const {
saveSale
} = require("../services/salesService");

const {
createDebt
} = require("../services/debtorService");

const {
getUserByTelegramId
} = require("../services/userService");

module.exports = async function salesFlow(ctx) {

const telegramId =
    ctx.from.id;

const session =
    getSession(telegramId);

if (!session) {
    return;
}

const text =
    (ctx.message.text || "").trim();


// ==================================================
// VERIFY ACCOUNT TYPE
// ==================================================
//
// Sales currently belongs to BUSINESS accounts.
//
// Personal accounts should never enter this flow.
//
// ==================================================

const user =
    getUserByTelegramId(
        telegramId
    );

const accountType =
    user &&
    user.account
        ? user.account.account_type
        : null;

if (
    accountType &&
    accountType !== "BUSINESS"
) {

    clearSession(telegramId);

    await ctx.reply(
        "ℹ️ Sales recording is available for Business accounts."
    );

    return;
}


// ==================================================
// PRODUCT
// ==================================================

if (
    session.state ===
    STATES.WAITING_FOR_PRODUCT
) {

    if (!text) {

        await ctx.reply(
            "❌ Please enter the product name."
        );

        return;
    }

    setSession(
        telegramId,
        {
            ...session,

            product:
                text,

            state:
                STATES.WAITING_FOR_QUANTITY
        }
    );

    await ctx.reply(
        "🔢 How many units did you sell?"
    );

    return;
}


// ==================================================
// QUANTITY
// ==================================================

if (
    session.state ===
    STATES.WAITING_FOR_QUANTITY
) {

    const quantity =
        Number(
            text.replace(/,/g, "")
        );

    if (
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {

        await ctx.reply(
            "❌ Please enter a valid quantity.\n\nExample: 5"
        );

        return;
    }

    setSession(
        telegramId,
        {
            ...session,

            quantity,

            state:
                STATES.WAITING_FOR_PRICE
        }
    );

    await ctx.reply(
        "💵 What was the selling price per unit?"
    );

    return;
}


// ==================================================
// PRICE
// ==================================================

if (
    session.state ===
    STATES.WAITING_FOR_PRICE
) {

    const price =
        Number(
            text.replace(/,/g, "")
        );

    if (
        !Number.isFinite(price) ||
        price < 0
    ) {

        await ctx.reply(
            "❌ Please enter a valid selling price.\n\nExample: 2500"
        );

        return;
    }

    setSession(
        telegramId,
        {
            ...session,

            price,

            state:
                STATES.WAITING_FOR_CUSTOMER
        }
    );

    await ctx.reply(
        "👤 Enter the customer name:"
    );

    return;
}


// ==================================================
// CUSTOMER
// ==================================================

if (
    session.state ===
    STATES.WAITING_FOR_CUSTOMER
) {

    if (!text) {

        await ctx.reply(
            "❌ Please enter the customer name."
        );

        return;
    }

    setSession(
        telegramId,
        {
            ...session,

            customer:
                text,

            state:
                STATES.WAITING_FOR_PAYMENT_STATUS
        }
    );

    await ctx.reply(
        "💳 How was this sale paid?",
        paymentKeyboard
    );

    return;
}


// ==================================================
// PAYMENT STATUS
// ==================================================

if (
    session.state ===
    STATES.WAITING_FOR_PAYMENT_STATUS
) {

    const paymentStatus =
        text.toLowerCase();


    const paid =
        paymentStatus.includes("paid") &&
        !paymentStatus.includes("unpaid") &&
        !paymentStatus.includes("credit");


    const credit =
        paymentStatus.includes("credit") ||
        paymentStatus.includes("unpaid") ||
        paymentStatus.includes("debt");


    if (
        !paid &&
        !credit
    ) {

        await ctx.reply(
            "❌ Please select a valid payment option.",
            paymentKeyboard
        );

        return;
    }


    // ==============================================
    // SAVE SALE
    // ==============================================

    try {

        const result =
            saveSale(
                telegramId,
                {
                    product:
                        session.product,

                    quantity:
                        session.quantity,

                    price:
                        session.price,

                    customer:
                        session.customer
                }
            );


        const sale =
            result.sale;


        const total =
            Number(
                sale.total
            ) || (
                Number(
                    session.quantity
                ) *
                Number(
                    session.price
                )
            );


        // ==========================================
        // CREATE DEBT IF CREDIT SALE
        // ==========================================

        let debtCreated =
            false;

        if (credit) {

            try {

                createDebt(

                    telegramId,

                    session.customer,

                    sale.id,

                    total

                );

                debtCreated =
                    true;

            } catch (debtError) {

                console.error(
                    "Debt creation error:",
                    debtError
                );

                await ctx.reply(
                    "⚠️ Sale was recorded, but I couldn't create the debtor record automatically."
                );

            }

        }


        // ==========================================
        // SUCCESS MESSAGE
        // ==========================================

        let message =

            `✅ Sale Recorded

━━━━━━━━━━━━━━━━━━

📦 Product: ${session.product}

🔢 Quantity: ${Number(
session.quantity
).toLocaleString()}

💵 Unit Price: ₦${Number(
session.price
).toLocaleString()}

👤 Customer: ${session.customer}

💰 Total Sale: ₦${total.toLocaleString()}`;

        if (debtCreated) {

            message += `

━━━━━━━━━━━━━━━━━━

🧾 Payment: Credit

👤 This sale has been added to Debtors.`;

        } else {

            message += `

━━━━━━━━━━━━━━━━━━

💳 Payment: Paid

✅ Customer paid in full.`;

        }


        await ctx.reply(
            message,
            keyboard
        );


        clearSession(
            telegramId
        );

        return;

    } catch (error) {

        console.error(
            "Sale save error:",
            error
        );


        // ==========================================
        // KNOWN ERRORS
        // ==========================================

        if (
            error.message ===
            "Product not found in inventory."
        ) {

            await ctx.reply(
                "❌ Product not found in inventory.\n\nPlease make sure the product exists in your inventory before recording a sale."
            );

            clearSession(
                telegramId
            );

            return;
        }


        if (
            error.message ===
            "Insufficient stock."
        ) {

            await ctx.reply(
                "❌ Insufficient stock.\n\nYou cannot sell more units than are currently available."
            );

            clearSession(
                telegramId
            );

            return;
        }


        if (
            error.message ===
            "Customer name is required."
        ) {

            await ctx.reply(
                "❌ Customer name is required."
            );

            return;
        }


        await ctx.reply(
            "❌ I couldn't record this sale right now. Please try again."
        );

        return;
    }

}

};