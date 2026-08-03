require("dotenv").config();

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

(async () => {

    try {

        console.log("Before getMe");

        const me = await bot.telegram.getMe();

        console.log("Connected:", me.username);

        console.log("Calling getUpdates...");

        const updates = await bot.telegram.callApi("getUpdates", {
            timeout: 1,
            offset: 0
        });

        console.log("SUCCESS!");
        console.log(updates);

    } catch (err) {

        console.error(err);

    }

})();