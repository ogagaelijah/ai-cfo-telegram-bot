require("dotenv").config();

const { Telegraf } = require("telegraf");

const config = require("./src/config/config");
const initializeDatabase = require("./src/database/schema");
const runMigrations = require("./src/database/migrationRunner");
const logger = require("./src/utils/logger");

if (!config.botToken) {

    console.error("❌ BOT_TOKEN is missing.");

    process.exit(1);

}

// Initialize database
initializeDatabase();

// Run migrations
runMigrations();

// Create bot
const bot = new Telegraf(config.botToken);

console.log("======================================");
console.log(`🤖 ${config.botName} is starting...`);
console.log("======================================");

// Register handlers
require("./src/handlers/start")(bot);
require("./src/handlers/router")(bot);

// Global error handler
bot.catch((error, ctx) => {

    logger.error(
        `Telegram Error (${ctx.updateType}): ${error.stack || error.message}`
    );

});

// Launch bot
bot.launch();

logger.info("AI CFO Bot started successfully.");

console.log("✅ AI CFO Bot is running...");

// Graceful shutdown
process.once("SIGINT", () => {

    logger.info("Bot stopped (SIGINT)");

    bot.stop("SIGINT");

});

process.once("SIGTERM", () => {

    logger.info("Bot stopped (SIGTERM)");

    bot.stop("SIGTERM");

});