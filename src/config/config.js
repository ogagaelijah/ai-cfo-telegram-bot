require("dotenv").config();

module.exports = {

    botName: process.env.BOT_NAME,

    botToken: process.env.BOT_TOKEN,

    openAIKey: process.env.OPENAI_API_KEY,

    reportTime: process.env.REPORT_TIME,

    databaseName: process.env.DATABASE_NAME,

    environment: process.env.NODE_ENV

};