/**
 * Sends a reply to the current Telegram user.
 *
 * This helper keeps the code cleaner by avoiding repeated
 * ctx.reply(...) calls throughout the handlers.
 */
async function reply(ctx, message, keyboard = undefined) {

    if (keyboard) {
        return ctx.reply(message, keyboard);
    }

    return ctx.reply(message);

}

module.exports = reply;