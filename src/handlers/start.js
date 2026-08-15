const {
    getUserByTelegramId
} = require("../services/userService");

const {
    startRegistration
} = require("../flows/registrationFlow");

const businessKeyboard =
    require("../keyboards/mainKeyboard");

const personalKeyboard =
    require("../keyboards/personal/personalKeyboard");


// ======================================================
// BUSINESS DASHBOARD
// ======================================================

async function showBusinessDashboard(
    ctx,
    user
) {

    const firstName =
        ctx.from.first_name ||
        user.full_name ||
        "User";


    const accountName =
        user.account &&
        user.account.name
            ? user.account.name
            : "My Business";


    const accountRole =
        user.account &&
        user.account.role
            ? user.account.role
            : "OWNER";


    // ==================================================
    // TEMPORARY SUMMARY
    // ==================================================

    const sales = 0;

    const expenses = 0;

    const profit =
        sales - expenses;


    await ctx.reply(

        `👋 Welcome back, ${firstName}!

🏢 Business: ${accountName}

━━━━━━━━━━━━━━━━━━

📊 Today's Summary

💰 Sales: ₦${sales.toLocaleString()}

💸 Expenses: ₦${expenses.toLocaleString()}

📈 Profit: ₦${profit.toLocaleString()}

━━━━━━━━━━━━━━━━━━

👤 Role: ${accountRole}

Choose an option below 👇`,

        businessKeyboard

    );

}


// ======================================================
// PERSONAL FINANCE DASHBOARD
// ======================================================

async function showPersonalDashboard(
    ctx,
    user
) {

    const firstName =
        ctx.from.first_name ||
        user.full_name ||
        "User";


    const accountName =
        user.account &&
        user.account.name
            ? user.account.name
            : "Personal Finance";


    const accountRole =
        user.account &&
        user.account.role
            ? user.account.role
            : "OWNER";


    await ctx.reply(

        `👋 Welcome back, ${firstName}!

👤 Personal Finance
🏦 Account: ${accountName}

━━━━━━━━━━━━━━━━━━

💰 Income
💸 Expenses
📋 Debts
👥 Debtors
💧 Cash Flow
📊 Financial Reports
🔮 Forecast
🤖 AI Financial Advisor

━━━━━━━━━━━━━━━━━━

👤 Role: ${accountRole}

Choose an option below 👇`,

        personalKeyboard

    );

}


// ======================================================
// START HANDLER
// ======================================================

module.exports = (bot) => {

    bot.start(async (ctx) => {

        try {

            // ==================================================
            // LOAD USER
            // ==================================================

            const existingUser =
                getUserByTelegramId(
                    ctx.from.id
                );


            // ==================================================
            // NEW USER
            // ==================================================

            if (!existingUser) {

                await startRegistration(ctx);

                return;

            }


            // ==================================================
            // CHECK CURRENT ACCOUNT
            // ==================================================

            if (!existingUser.account) {

                await ctx.reply(
                    "⚠️ Your user account was found, but no current account is selected. Please contact support."
                );

                return;

            }


            // ==================================================
            // DETERMINE ACCOUNT TYPE
            // ==================================================

            const accountType =
                existingUser.account.account_type
                    ? String(
                        existingUser.account.account_type
                    )
                        .trim()
                        .toUpperCase()
                    : "BUSINESS";


            // ==================================================
            // PERSONAL ACCOUNT
            // ==================================================

            if (
                accountType === "PERSONAL"
            ) {

                await showPersonalDashboard(
                    ctx,
                    existingUser
                );

                return;

            }


            // ==================================================
            // BUSINESS ACCOUNT
            // ==================================================

            if (
                accountType === "BUSINESS"
            ) {

                await showBusinessDashboard(
                    ctx,
                    existingUser
                );

                return;

            }


            // ==================================================
            // UNKNOWN ACCOUNT TYPE
            // ==================================================

            await ctx.reply(
                `⚠️ Unsupported account type: ${accountType}`
            );

        }

        catch (error) {

            console.error(
                "❌ /start error:",
                error
            );

            await ctx.reply(
                "⚠️ Something went wrong while loading your account. Please try again."
            );

        }

    });

};