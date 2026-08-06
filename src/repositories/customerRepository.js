const db = require("../database/database");

// ==========================
// CREATE CUSTOMER
// ==========================
function create(customer) {

    const result = db.prepare(`
        INSERT INTO customers
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

        customer.userId,

        customer.name,

        customer.phone || null,

        customer.email || null,

        customer.address || null

    );

    return findById(result.lastInsertRowid);

}

// ==========================
// FIND CUSTOMER BY ID
// ==========================
function findById(id) {

    return db.prepare(`
        SELECT *
        FROM customers
        WHERE id = ?
    `).get(id);

}

// ==========================
// FIND CUSTOMER BY NAME
// ==========================
function findByName(userId, name) {

    return db.prepare(`
        SELECT *
        FROM customers
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

// ==========================
// FIND CUSTOMER OR CREATE
// ==========================
function findOrCreate(userId, name) {

    const customer =
        findByName(userId, name);

    if (customer) {

        return customer;

    }

    return create({

        userId,

        name,

        phone: null,

        email: null,

        address: null

    });

}

// ==========================
// GET ALL CUSTOMERS
// ==========================
function findAll(userId) {

    return db.prepare(`
        SELECT *
        FROM customers
        WHERE user_id = ?
        ORDER BY name
    `).all(userId);

}

// ==========================
// SEARCH CUSTOMERS
// ==========================
function search(userId, keyword) {

    return db.prepare(`
        SELECT *
        FROM customers
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

        `%${keyword}%`,

        `%${keyword}%`,

        `%${keyword}%`

    );

}

module.exports = {

    create,

    findById,

    findByName,

    findOrCreate,

    findAll,

    search

};