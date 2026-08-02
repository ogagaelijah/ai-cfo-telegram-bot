const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

    ["➕ Add Customer"],

    ["🔍 Search Customer"],

    ["📋 Customer List"],

    ["⬅️ Back"]

])
.resize();