const db = require("../database/database");

// ==========================
// CREATE SUPPLIER
// ==========================
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

// ==========================
// FIND SUPPLIER BY ID
// ==========================
function findById(id) {

    return db.prepare(`
        SELECT *
        FROM suppliers
        WHERE id = ?
    `).get(id);

}

// ==========================
// GET ALL SUPPLIERS
// ==========================
function findAll(userId) {

    return db.prepare(`
        SELECT *
        FROM suppliers
        WHERE user_id = ?
        ORDER BY name
    `).all(userId);

}

// ==========================
// SEARCH SUPPLIERS
// ==========================
function search(userId, keyword) {

    const searchTerm =
        `%${keyword.trim()}%`;

    return db.prepare(`
        SELECT *
        FROM suppliers
        WHERE
            user_id = ?
        AND
        (
            name LIKE ?
            OR phone LIKE ?
            OR email LIKE ?
        )
        ORDER BY name
    `).all(

        userId,

        searchTerm,

        searchTerm,

        searchTerm

    );

}

// ==========================
// FIND SUPPLIER BY NAME
// ==========================
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