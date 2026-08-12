const db = require("../database/database");

// ======================================================
// CREATE SUPPLIER
// ======================================================

function create(supplier) {

    const result = db.prepare(`
        INSERT INTO suppliers
        (
            account_id,
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

        supplier.accountId,

        supplier.name,

        supplier.phone || null,

        supplier.email || null,

        supplier.address || null

    );

    return findById(
        result.lastInsertRowid
    );

}


// ======================================================
// FIND SUPPLIER BY ID
// ======================================================

function findById(id) {

    return db.prepare(`
        SELECT *
        FROM suppliers

        WHERE
            id = ?

        LIMIT 1
    `).get(id);

}


// ======================================================
// GET ALL SUPPLIERS FOR ACCOUNT
// ======================================================

function findAll(accountId) {

    return db.prepare(`
        SELECT *
        FROM suppliers

        WHERE
            account_id = ?

        ORDER BY
            name ASC
    `).all(accountId);

}


// ======================================================
// SEARCH SUPPLIERS
// ======================================================

function search(accountId, keyword) {

    const searchTerm =
        `%${String(keyword || "").trim()}%`;

    return db.prepare(`
        SELECT *
        FROM suppliers

        WHERE
            account_id = ?

            AND
            (
                name LIKE ?

                OR phone LIKE ?

                OR email LIKE ?
            )

        ORDER BY
            name ASC
    `).all(

        accountId,

        searchTerm,

        searchTerm,

        searchTerm

    );

}


// ======================================================
// FIND SUPPLIER BY NAME
// ======================================================

function findByName(accountId, name) {

    return db.prepare(`
        SELECT *
        FROM suppliers

        WHERE
            account_id = ?

            AND LOWER(name) =
                LOWER(?)

        LIMIT 1
    `).get(

        accountId,

        String(name || "").trim()

    );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    create,

    findById,

    findAll,

    search,

    findByName

};