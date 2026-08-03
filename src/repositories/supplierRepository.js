const db = require("../database/database");

/**
 * Create supplier
 */
function create(supplier) {

    const result = db.prepare(`
        INSERT INTO suppliers
        (
            user_id,
            name,
            phone,
            email,
            address
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?
        )
    `).run(

        supplier.userId,
        supplier.name,
        supplier.phone,
        supplier.email,
        supplier.address

    );

    return findById(result.lastInsertRowid);

}

/**
 * Find supplier by ID
 */
function findById(id) {

    return db.prepare(`
        SELECT *
        FROM suppliers
        WHERE id = ?
    `).get(id);

}

/**
 * Get all suppliers
 */
function findAll(userId) {

    return db.prepare(`
        SELECT *
        FROM suppliers
        WHERE user_id = ?
        ORDER BY name
    `).all(userId);

}

/**
 * Search suppliers
 */
function search(userId, keyword) {

    return db.prepare(`
        SELECT *
        FROM suppliers
        WHERE
            user_id = ?
        AND
        (
            name LIKE ?
            OR phone LIKE ?
        )
        ORDER BY name
    `).all(

        userId,
        `%${keyword}%`,
        `%${keyword}%`

    );

}

/**
 * Find supplier by name
 */
function findByName(userId, name) {

    return db.prepare(`
        SELECT *
        FROM suppliers
        WHERE
            user_id = ?
        AND
            LOWER(name) = LOWER(?)
        LIMIT 1
    `).get(

        userId,
        name.trim()

    );

}

module.exports = {

    create,

    findById,

    findAll,

    search,

    findByName

};