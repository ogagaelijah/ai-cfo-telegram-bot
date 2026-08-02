const keyboard = require("../keyboards/mainKeyboard");

const {
    getTodaySummary
} = require("../services/reportService");

module.exports = async function reportFlow(ctx) {

    const summary = getTodaySummary(ctx.from.id);

    let health = "🟢 Excellent";
    let advice = "Great job! Keep recording every transaction.";

    if (summary.sales === 0 && summary.expenses > 0) {
        health = "🔴 Loss";
        advice = "You have expenses but no recorded sales today.";
    }
    else if (summary.profit < 0) {
        health = "🔴 Loss";
        advice = "Today's expenses are higher than today's sales.";
    }
    else if (summary.sales > 0) {

        const expenseRate = (summary.expenses / summary.sales) * 100;

        if (expenseRate > 70) {
            health = "🟠 High Expenses";
            advice = "Your expenses are consuming most of your revenue.";
        }
        else if (expenseRate > 40) {
            health = "🟡 Fair";
            advice = "Monitor your spending closely.";
        }
    }

    await ctx.reply(

`📊 AI CFO DAILY SUMMARY

━━━━━━━━━━━━━━━━━━

💰 Sales
₦${summary.sales.toLocaleString()}

💸 Expenses
₦${summary.expenses.toLocaleString()}

📈 Profit
₦${summary.profit.toLocaleString()}

🧾 Transactions
${summary.transactions}

━━━━━━━━━━━━━━━━━━

📊 Financial Health

${health}

💡 AI Insight

${advice}`,

        keyboard

    );

};