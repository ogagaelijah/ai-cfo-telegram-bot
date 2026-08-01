const db = require("../database/database");

/**
 * Returns the internal database user ID
 * from a Telegram ID.
 */
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

/**
 * Save a sale.
 */
function saveSale(telegramId, sale) {

    const userId = getUserId(telegramId);

    db.prepare(`
        INSERT INTO sales
        (
            user_id,
            item,
            quantity,
            unit_price,
            total,
            customer_name
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )
    `).run(

        userId,
        sale.product,
        sale.quantity,
        sale.price,
        sale.quantity * sale.price,
        sale.customer

    );

}

module.exports = {

    saveSale

};