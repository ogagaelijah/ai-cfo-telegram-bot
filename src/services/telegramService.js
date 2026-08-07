// ==========================
// TELEGRAM BOT INSTANCE
// ==========================
let bot = null;

// ==========================
// REGISTER BOT
// ==========================
function registerBot(botInstance) {

    bot = botInstance;

}

// ==========================
// SEND MESSAGE
// ==========================
async function sendMessage(chatId, message, extra = {}) {

    if (!bot) {
        throw new Error("Telegram bot has not been registered.");
    }

    return bot.telegram.sendMessage(
        chatId,
        message,
        extra
    );

}

module.exports = {

    registerBot,

    sendMessage

};