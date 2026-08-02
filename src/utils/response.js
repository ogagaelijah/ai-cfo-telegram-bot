async function success(ctx, message, keyboard = null) {

    if (keyboard) {

        return ctx.reply(
            `✅ ${message}`,
            keyboard
        );

    }

    return ctx.reply(
        `✅ ${message}`
    );

}

async function error(ctx, message) {

    return ctx.reply(
        `❌ ${message}`
    );

}

async function info(ctx, message) {

    return ctx.reply(
        `ℹ️ ${message}`
    );

}

module.exports = {

    success,
    error,
    info

};