const db = require("../database/database");

function getUserId(telegramId) {

    const user = db.prepare(`
        SELECT id
        FROM users
        WHERE telegram_id = ?
    `).get(telegramId);

    if (!user) {
        throw new Error("User not found.");
    }

    return user.id;
}

function saveIncome(telegramId, income) {

    const userId = getUserId(telegramId);

    db.prepare(`
        INSERT INTO income
        (
            user_id,
            source,
            amount,
            notes
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?
        )
    `).run(

        userId,
        income.source,
        income.amount,
        income.notes

    );

}

function getTodayIncome(telegramId) {

    const userId = getUserId(telegramId);

    const result = db.prepare(`
        SELECT SUM(amount) AS total
        FROM income
        WHERE user_id = ?
        AND DATE(created_at)=DATE('now','localtime')
    `).get(userId);

    return result.total || 0;

}

module.exports = {

    saveIncome,
    getTodayIncome

};