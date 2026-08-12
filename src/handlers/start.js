const {
    createUser
} = require("../services/userService");

const keyboard =
    require("../keyboards/mainKeyboard");

module.exports = (bot) => {

    bot.start(async (ctx) => {

        // ==============================================
        // CREATE / LOAD USER
        // ==============================================
        //
        // createUser() is responsible for:
        //
        // User
        //   ↓
        // Account
        //   ↓
        // Account Membership
        //
        // It also returns the user's current account.
        //

        const user =
            createUser(ctx.from);


        // ==============================================
        // USER NAME
        // ==============================================

        const firstName =
            ctx.from.first_name ||
            user.full_name ||
            "User";


        // ==============================================
        // CURRENT BUSINESS / ACCOUNT
        // ==============================================
        //
        // The business name belongs to the ACCOUNT,
        // not the USER.
        //
        // createUser() returns:
        //
        // user.account.id
        // user.account.name
        // user.account.role
        //
        // Therefore we use the account returned directly
        // from the user service.
        //

        const businessName =
            user.account &&
            user.account.name
                ? user.account.name
                : "My Business";


        // ==============================================
        // CURRENT ACCOUNT ROLE
        // ==============================================

        const accountRole =
            user.account &&
            user.account.role
                ? user.account.role
                : "OWNER";


        // ==============================================
        // PHASE 1 SUMMARY
        // ==============================================
        //
        // These values are temporary.
        //
        // Later they will be calculated from the
        // CURRENT ACCOUNT only.
        //
        // IMPORTANT:
        //
        // They must never be calculated globally across
        // all businesses belonging to the user.
        //

        const sales = 0;

        const expenses = 0;

        const profit =
            sales - expenses;


        // ==============================================
        // WELCOME MESSAGE
        // ==============================================

        await ctx.reply(

            `👋 Welcome, ${firstName}!

🏢 Business: ${businessName}

━━━━━━━━━━━━━━━━━━

📊 Today's Summary

💰 Sales: ₦${sales.toLocaleString()}

💸 Expenses: ₦${expenses.toLocaleString()}

📈 Profit: ₦${profit.toLocaleString()}

━━━━━━━━━━━━━━━━━━

👤 Role: ${accountRole}

Choose an option below 👇`,

            keyboard

        );

    });

};