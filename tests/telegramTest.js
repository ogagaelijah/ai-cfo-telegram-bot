require("dotenv").config();

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

(async () => {

    try {

        console.log("Connecting to Telegram...");

        const me = await bot.telegram.getMe();

        console.log("SUCCESS!");

        console.log(me);

    } catch (error) {

        console.error("ERROR:");

        console.error(error);

    }

})();