require("dotenv").config();

const { Telegraf } = require("telegraf");
const config = require("./config/config");
const initializeDatabase = require("./database/schema");

if (!config.botToken) {
    console.error("❌ BOT_TOKEN is missing in .env");
    process.exit(1);
}

// Initialize database
initializeDatabase();

// Create bot
const bot = new Telegraf(config.botToken);

console.log("======================================");
console.log(`🤖 ${config.botName} is starting...`);
console.log("======================================");

// Load handlers
require("./handlers/start")(bot);
require("./handlers/messageHandler")(bot);

// Launch bot
bot.launch();

console.log("✅ AI CFO Bot is running...");

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));