// ==========================
// AI CFO CONVERSATION SERVICE
// ==========================

// In-memory conversation store.
// We will move this to the database later
// so conversations survive bot restarts.

const conversations = new Map();

// ==========================
// GET CONVERSATION
// ==========================
function getConversation(telegramId) {

    if (!conversations.has(telegramId)) {

        conversations.set(telegramId, {

            currentTopic: null,

            previousTopic: null,

            lastQuestion: null,

            lastAnswer: null

        });

    }

    return conversations.get(telegramId);

}

// ==========================
// SET TOPIC
// ==========================
function setTopic(telegramId, topic) {

    const conversation =
        getConversation(telegramId);

    if (
        topic &&
        topic !== conversation.currentTopic
    ) {

        conversation.previousTopic =
            conversation.currentTopic;

        conversation.currentTopic =
            topic;

    }

}

// ==========================
// SAVE MESSAGE
// ==========================
function saveConversation(
    telegramId,
    question,
    answer
) {

    const conversation =
        getConversation(telegramId);

    conversation.lastQuestion =
        question;

    conversation.lastAnswer =
        answer;

}

// ==========================
// GET CURRENT TOPIC
// ==========================
function getCurrentTopic(telegramId) {

    const conversation =
        getConversation(telegramId);

    return conversation.currentTopic;

}

// ==========================
// GET PREVIOUS TOPIC
// ==========================
function getPreviousTopic(telegramId) {

    const conversation =
        getConversation(telegramId);

    return conversation.previousTopic;

}

// ==========================
// CLEAR CONVERSATION
// ==========================
function clearConversation(telegramId) {

    conversations.delete(telegramId);

}

// ==========================
// EXPORT
// ==========================
module.exports = {

    getConversation,

    setTopic,

    saveConversation,

    getCurrentTopic,

    getPreviousTopic,

    clearConversation

};