const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

    ["💰 Inflows - Week", "💸 Outflows - Week"],

    ["💰 Inflows - Month", "💸 Outflows - Month"],

    ["💰 Inflows - Year", "💸 Outflows - Year"],

    ["📊 Net Cash Flow - Week"],

    ["📊 Net Cash Flow - Month"],

    ["📊 Net Cash Flow - Year"],

    ["⬅️ Back to Personal Finance"]

]).resize();