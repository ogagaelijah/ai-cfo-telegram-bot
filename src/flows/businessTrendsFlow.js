const keyboard = require("../keyboards/reportKeyboard");

const {
    getBusinessTrends
} = require("../services/businessTrendsService");

module.exports = async function businessTrendsFlow(ctx) {

    const trends = getBusinessTrends(ctx.from.id);

    await ctx.reply(

`📉 AI CFO BUSINESS TRENDS

━━━━━━━━━━━━━━━━━━

📅 DAILY SALES

Today
₦${trends.daily.today.toLocaleString()}

Yesterday
₦${trends.daily.yesterday.toLocaleString()}

Growth
${trends.daily.growth.toFixed(2)}%

━━━━━━━━━━━━━━━━━━

📆 WEEKLY SALES

This Week
₦${trends.weekly.thisWeek.toLocaleString()}

Last Week
₦${trends.weekly.lastWeek.toLocaleString()}

Growth
${trends.weekly.growth.toFixed(2)}%

━━━━━━━━━━━━━━━━━━

🗓 MONTHLY SALES

This Month
₦${trends.monthly.thisMonth.toLocaleString()}

Last Month
₦${trends.monthly.lastMonth.toLocaleString()}

Growth
${trends.monthly.growth.toFixed(2)}%

━━━━━━━━━━━━━━━━━━

🤖 AI TREND SUMMARY

${trends.summary}`,

        keyboard

    );

};