const db = require("./database");

function initializeDatabase() {

    // ==========================
    // USERS
    // ==========================
    db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            telegram_id INTEGER UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            username TEXT,
            business_name TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `).run();


    // ==========================
    // CUSTOMERS
    // ==========================
    db.prepare(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            address TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `).run();


    // ==========================
    // SUPPLIERS
    // ==========================
    db.prepare(`
        CREATE TABLE IF NOT EXISTS suppliers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            address TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `).run();


    // ==========================
    // SALES
    // ==========================
    db.prepare(`
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,
            customer_id INTEGER,

            inventory_id INTEGER,

            item TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price REAL NOT NULL,

            cost_price REAL DEFAULT 0,

            revenue REAL DEFAULT 0,
            cost_of_goods REAL DEFAULT 0,
            profit REAL DEFAULT 0,

            total REAL NOT NULL,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(user_id)
                REFERENCES users(id),

            FOREIGN KEY(customer_id)
                REFERENCES customers(id),

            FOREIGN KEY(inventory_id)
                REFERENCES inventory(id)
        )
    `).run();


    // ==========================
    // EXPENSES
    // ==========================
    db.prepare(`
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            item TEXT NOT NULL,
            category TEXT,
            amount REAL NOT NULL,
            notes TEXT,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(user_id)
                REFERENCES users(id)
        )
    `).run();


    // ==========================
    // INCOME
    // ==========================
    db.prepare(`
        CREATE TABLE IF NOT EXISTS income (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            source TEXT,
            amount REAL NOT NULL,
            notes TEXT,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(user_id)
                REFERENCES users(id)
        )
    `).run();


    // ==========================
    // INVENTORY
    // ==========================
    db.prepare(`
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            product_name TEXT NOT NULL,

            quantity INTEGER DEFAULT 0,

            cost_price REAL DEFAULT 0,
            selling_price REAL DEFAULT 0,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(user_id)
                REFERENCES users(id)
        )
    `).run();


    // ==========================
    // DEBTORS
    // ==========================
    db.prepare(`
        CREATE TABLE IF NOT EXISTS debtors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,
            customer_id INTEGER NOT NULL,
            sale_id INTEGER NOT NULL,

            total_amount REAL NOT NULL,
            amount_paid REAL DEFAULT 0,
            balance REAL NOT NULL,

            status TEXT DEFAULT 'UNPAID',

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(user_id)
                REFERENCES users(id),

            FOREIGN KEY(customer_id)
                REFERENCES customers(id),

            FOREIGN KEY(sale_id)
                REFERENCES sales(id)
        )
    `).run();


    // ==========================
    // PURCHASES
    // ==========================
    db.prepare(`
        CREATE TABLE IF NOT EXISTS purchases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,
            supplier_id INTEGER NOT NULL,
            inventory_id INTEGER NOT NULL,

            quantity INTEGER NOT NULL,

            unit_cost REAL NOT NULL,
            total_amount REAL NOT NULL,

            payment_status TEXT DEFAULT 'PAID',

            amount_paid REAL DEFAULT 0,
            balance REAL DEFAULT 0,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(user_id)
                REFERENCES users(id),

            FOREIGN KEY(supplier_id)
                REFERENCES suppliers(id),

            FOREIGN KEY(inventory_id)
                REFERENCES inventory(id)
        )
    `).run();


    // ==========================
    // CREDITORS
    // ==========================
    db.prepare(`
        CREATE TABLE IF NOT EXISTS creditors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,
            supplier_id INTEGER NOT NULL,
            purchase_id INTEGER NOT NULL,

            total_amount REAL NOT NULL,
            amount_paid REAL DEFAULT 0,
            balance REAL NOT NULL,

            status TEXT DEFAULT 'UNPAID',

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(user_id)
                REFERENCES users(id),

            FOREIGN KEY(supplier_id)
                REFERENCES suppliers(id),

            FOREIGN KEY(purchase_id)
                REFERENCES purchases(id)
        )
    `).run();


    console.log("✅ Database initialized successfully.");
}

module.exports = initializeDatabase;