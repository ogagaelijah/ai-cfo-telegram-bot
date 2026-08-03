const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

    ["➕ Add Stock"],

    ["📋 View Inventory"],

    ["⚠️ Low Stock"],

    ["⬅️ Back"]

])
.resize();