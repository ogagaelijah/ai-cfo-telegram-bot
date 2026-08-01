// states/sessionManager.js

const sessions = new Map();

/**
 * Get a user's session.
 */
function getSession(userId) {
    return sessions.get(userId);
}

/**
 * Save or update a user's session.
 */
function setSession(userId, data) {
    sessions.set(userId, data);
}

/**
 * Remove a user's session.
 */
function clearSession(userId) {
    sessions.delete(userId);
}

module.exports = {
    getSession,
    setSession,
    clearSession
};