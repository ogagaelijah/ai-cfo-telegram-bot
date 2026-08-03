const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

    ["➕ Add Supplier"],

    ["📋 Supplier List"],

    ["🔍 Search Supplier"],

    ["⬅️ Back"]

])
.resize();