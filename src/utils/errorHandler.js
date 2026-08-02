const logger = require("./logger");

async function handleError(ctx, error) {

    logger.error(error.stack || error.message);

    try {

        await ctx.reply(
            "❌ Something went wrong.\n\nThe error has been logged and we're working on it."
        );

    } catch {

        logger.error(
            "Unable to send error message to user."
        );

    }

}

module.exports = {

    handleError

};