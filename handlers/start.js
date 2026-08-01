const { createUser } = require("../services/userService");
const keyboard = require("../keyboards/mainKeyboard");

module.exports = (bot) => {

    bot.start(async (ctx) => {

        createUser(ctx.from);

        const firstName = ctx.from.first_name || "User";

        // Phase 1 Summary (will become dynamic later)
        const sales = 0;
        const expenses = 0;
        const profit = sales - expenses;

        await ctx.reply(

`👋 Welcome, ${firstName}!

🏢 Business: Not Set

━━━━━━━━━━━━━━

📊 Today's Summary

💰 Sales: ₦${sales.toLocaleString()}

💸 Expenses: ₦${expenses.toLocaleString()}

📈 Profit: ₦${profit.toLocaleString()}

━━━━━━━━━━━━━━

Choose an option below 👇`,

            keyboard

        );

    });

};