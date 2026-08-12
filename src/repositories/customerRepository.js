const db = require("../database/database");

// ======================================================
// CREATE CUSTOMER
// ======================================================

function create(customer) {

    const result = db.prepare(`
        INSERT INTO customers
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

        customer.accountId,

        customer.name,

        customer.phone || null,

        customer.email || null,

        customer.address || null

    );

    return findById(
        result.lastInsertRowid
    );

}


// ======================================================
// FIND CUSTOMER BY ID
// ======================================================

function findById(id) {

    return db.prepare(`
        SELECT *
        FROM customers

        WHERE
            id = ?

        LIMIT 1
    `).get(id);

}


// ======================================================
// GET ALL CUSTOMERS FOR ACCOUNT
// ======================================================

function findAll(accountId) {

    return db.prepare(`
        SELECT *
        FROM customers

        WHERE
            account_id = ?

        ORDER BY
            name ASC
    `).all(accountId);

}


// ======================================================
// SEARCH CUSTOMERS
// ======================================================

function search(
    accountId,
    keyword
) {

    const searchTerm =
        `%${String(keyword || "").trim()}%`;

    return db.prepare(`
        SELECT *
        FROM customers

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
// FIND CUSTOMER BY NAME
// ======================================================

function findByName(
    accountId,
    name
) {

    return db.prepare(`
        SELECT *
        FROM customers

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