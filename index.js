require("dotenv").config();

const { Telegraf } = require("telegraf");
const config = require("./config/config");
const initializeDatabase = require("./database/schema");

// ==========================
// CHECK BOT TOKEN
// ==========================
if (!config.botToken) {
    console.error("❌ BOT_TOKEN is missing in your .env file.");
    process.exit(1);
}

// ==========================
// INITIALIZE DATABASE
// ==========================
initializeDatabase();

// ==========================
// CREATE BOT
// ==========================
const bot = new Telegraf(config.botToken);

console.log("======================================");
console.log(`🤖 ${config.botName} is starting...`);
console.log("======================================");

// ==========================
// LOAD HANDLERS
// ==========================
require("./handlers/start")(bot);
require("./handlers/router")(bot);

// ==========================
// START BOT
// ==========================
bot.launch();

console.log("✅ AI CFO Bot is running...");

// ==========================
// GRACEFUL SHUTDOWN
// ==========================
process.once("SIGINT", () => {
    console.log("🛑 Bot stopped (SIGINT)");
    bot.stop("SIGINT");
});

process.once("SIGTERM", () => {
    console.log("🛑 Bot stopped (SIGTERM)");
    bot.stop("SIGTERM");
});