require("dotenv").config();

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    console.log("START RECEIVED");
    return ctx.reply("✅ Simple bot is alive!");
});

(async () => {
    try {
        console.log("Launching...");

        await bot.launch({
            dropPendingUpdates: true
        });

        console.log("Bot launched.");

        process.once("SIGINT", () => bot.stop("SIGINT"));
        process.once("SIGTERM", () => bot.stop("SIGTERM"));

    } catch (err) {
        console.error(err);
    }
})();