const keyboard = require("../keyboards/mainKeyboard");

const {
    getBusinessForecast
} = require("../services/financialAnalyticsService");

module.exports = async function forecastFlow(ctx) {

    const forecast =
        getBusinessForecast(ctx.from.id);

    await ctx.reply(

`📈 AI CFO BUSINESS FORECAST

━━━━━━━━━━━━━━━━━━

📊 DAILY AVERAGES

💰 Average Daily Revenue

₦${forecast.averageDailySales.toLocaleString()}

💸 Average Daily Expenses

₦${forecast.averageDailyExpenses.toLocaleString()}

━━━━━━━━━━━━━━━━━━

📅 NEXT 7 DAYS

📈 Expected Revenue

₦${forecast.forecast7DaysRevenue.toLocaleString()}

💰 Expected Cash Position

₦${forecast.forecast7DaysCash.toLocaleString()}

━━━━━━━━━━━━━━━━━━

📅 NEXT 30 DAYS

📈 Expected Revenue

₦${forecast.forecast30DaysRevenue.toLocaleString()}

💰 Expected Cash Position

₦${forecast.forecast30DaysCash.toLocaleString()}

━━━━━━━━━━━━━━━━━━

🤖 CFO OUTLOOK

${
forecast.forecast30DaysCash > 0
?
"✅ Current business trend suggests positive cash growth over the next month."
:
"⚠️ Cash flow may become negative if current trends continue."
}

These forecasts are based on your historical business performance and will become more accurate as more transactions are recorded.`,

        keyboard

    );

};