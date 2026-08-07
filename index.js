require("dotenv").config();

const { Telegraf } = require("telegraf");

const config = require("./src/config/config");
const initializeDatabase = require("./src/database/schema");
const runMigrations = require("./src/database/migrationRunner");
const logger = require("./src/utils/logger");
const telegramService = require("./src/services/telegramService");
const { startSchedulers } = require("./src/scheduler/scheduler");

// ==========================
// CHECK BOT TOKEN
// ==========================
if (!config.botToken) {

    console.error("❌ BOT_TOKEN is missing.");

    process.exit(1);

}

// ==========================
// INITIALIZE DATABASE
// ==========================
initializeDatabase();

runMigrations();

// ==========================
// CREATE BOT
// ==========================
const bot = new Telegraf(config.botToken);

// ==========================
// REGISTER TELEGRAM BOT
// ==========================
telegramService.registerBot(bot);

console.log("======================================");
console.log(`🤖 ${config.botName} is starting...`);
console.log("======================================");

// ==========================
// REGISTER HANDLERS
// ==========================
require("./src/handlers/start")(bot);
require("./src/handlers/router")(bot);
require("./src/handlers/forecast")(bot);

// ==========================
// GLOBAL ERROR HANDLER
// ==========================
bot.catch((error, ctx) => {

    logger.error(
        `Telegram Error (${ctx?.updateType || "unknown"}): ${error.stack || error.message}`
    );

});

// ==========================
// START BOT
// ==========================
(async () => {

    try {

        console.log("Step 1");

        const me = await bot.telegram.getMe();

        console.log("Step 2:", me.username);

        console.log("Step 3");

        await bot.launch({

            dropPendingUpdates: true

        });

        // ==========================
        // START ALL SCHEDULERS
        // ==========================
        startSchedulers();

        console.log("Step 4");

        console.log("======================================");
        console.log("✅ Launch successful");
        console.log(`🤖 Connected as: @${me.username}`);
        console.log("======================================");

        logger.info("AI CFO Bot started successfully.");

        console.log("✅ AI CFO Bot is running...");

    } catch (error) {

        console.error("======================================");
        console.error("❌ BOT FAILED TO START");
        console.error(error);
        console.error("======================================");

        process.exit(1);

    }

})();

// ==========================
// GRACEFUL SHUTDOWN
// ==========================
process.once("SIGINT", () => {

    logger.info("Bot stopped (SIGINT)");

    bot.stop("SIGINT");

});

process.once("SIGTERM", () => {

    logger.info("Bot stopped (SIGTERM)");

    bot.stop("SIGTERM");

});