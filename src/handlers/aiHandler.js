const aiChat =
    require("../services/aiChatService");

// ==========================
// AI CHAT HANDLER
// ==========================
module.exports = async function aiHandler(ctx) {

    const text =
        ctx.message.text;

    const telegramId =
        ctx.from.id;

    const lowerText =
        text
            .toLowerCase()
            .trim();

    // ==========================
    // OPEN AI MODE
    // ==========================
    if (text === "🤖 Ask AI") {

        await ctx.reply(
`🤖 AI CFO

Ask me anything about your business.

Examples:

• Why is my cash flow negative?
• What should I focus on today?
• What is my biggest business risk?
• How is my profit?
• How are my sales?

You can also ask follow-up questions such as:

• Why?
• Explain more
• How can I fix it?
• What should I do?`
        );

        return true;
    }

    // ==========================
    // FOLLOW-UP QUESTIONS
    // ==========================
    const followUp =
        aiChat.isFollowUp(text);

    // ==========================
    // ACTIVE AI CONVERSATION
    // ==========================
    const activeConversation =
        aiChat.hasActiveConversation(
            telegramId
        );

    // ==========================
    // BUSINESS KEYWORDS
    // ==========================
    const businessQuestion =
        text.endsWith("?") ||

        lowerText.includes("cash") ||

        lowerText.includes("profit") ||

        lowerText.includes("sales") ||

        lowerText.includes("revenue") ||

        lowerText.includes("risk") ||

        lowerText.includes("focus") ||

        lowerText.includes("priority") ||

        lowerText.includes("explain") ||

        lowerText.includes("tell me more") ||

        lowerText.includes("should i") ||

        lowerText.includes("how can i") ||

        lowerText.includes("what should i");

    // ==========================
    // FOLLOW-UP WITH ACTIVE TOPIC
    // ==========================
    if (
        followUp &&
        activeConversation
    ) {

        const answer =
            aiChat.processQuestion(
                telegramId,
                text
            );

        await ctx.reply(answer);

        return true;
    }

    // ==========================
    // NEW BUSINESS QUESTION
    // ==========================
    if (businessQuestion) {

        const answer =
            aiChat.processQuestion(
                telegramId,
                text
            );

        await ctx.reply(answer);

        return true;
    }

    // ==========================
    // NOT AN AI MESSAGE
    // ==========================
    return false;

};