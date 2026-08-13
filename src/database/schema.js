const db = require("./database");

function initializeDatabase() {

    // ======================================================
    // USERS
    // ======================================================

    db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            telegram_id INTEGER UNIQUE NOT NULL,

            full_name TEXT NOT NULL,

            username TEXT,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `).run();


    // ======================================================
    // ACCOUNTS
    // ======================================================

    db.prepare(`
        CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            account_type TEXT NOT NULL DEFAULT 'BUSINESS',

            owner_user_id INTEGER NOT NULL,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(owner_user_id)
                REFERENCES users(id)
        )
    `).run();


    // ======================================================
    // ACCOUNT MEMBERS
    // ======================================================

    db.prepare(`
        CREATE TABLE IF NOT EXISTS account_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            account_id INTEGER NOT NULL,

            user_id INTEGER NOT NULL,

            role TEXT NOT NULL DEFAULT 'OWNER',

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(account_id, user_id),

            FOREIGN KEY(account_id)
                REFERENCES accounts(id),

            FOREIGN KEY(user_id)
                REFERENCES users(id)
        )
    `).run();


    // ======================================================
    // CURRENT ACCOUNT
    // ======================================================

    db.prepare(`
        CREATE TABLE IF NOT EXISTS user_current_accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL UNIQUE,

            account_id INTEGER NOT NULL,

            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(user_id)
                REFERENCES users(id),

            FOREIGN KEY(account_id)
                REFERENCES accounts(id)
        )
    `).run();


    // ======================================================
    // CUSTOMERS
    // ======================================================

    db.prepare(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            account_id INTEGER NOT NULL,

            name TEXT NOT NULL,

            phone TEXT,

            email TEXT,

            address TEXT,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(account_id)
                REFERENCES accounts(id)
        )
    `).run();


    // ======================================================
    // SUPPLIERS
    // ======================================================

    db.prepare(`
        CREATE TABLE IF NOT EXISTS suppliers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            account_id INTEGER NOT NULL,

            name TEXT NOT NULL,

            phone TEXT,

            email TEXT,

            address TEXT,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(account_id)
                REFERENCES accounts(id)
        )
    `).run();


    // ======================================================
    // INVENTORY
    // ======================================================

    db.prepare(`
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            account_id INTEGER NOT NULL,

            product_name TEXT NOT NULL,

            quantity INTEGER DEFAULT 0,

            cost_price REAL DEFAULT 0,

            selling_price REAL DEFAULT 0,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(account_id)
                REFERENCES accounts(id)
        )
    `).run();


    // ======================================================
    // SALES
    // ======================================================

    db.prepare(`
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            account_id INTEGER NOT NULL,

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

            FOREIGN KEY(account_id)
                REFERENCES accounts(id),

            FOREIGN KEY(customer_id)
                REFERENCES customers(id),

            FOREIGN KEY(inventory_id)
                REFERENCES inventory(id)
        )
    `).run();


    // ======================================================
    // EXPENSES
    // ======================================================

    db.prepare(`
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            account_id INTEGER NOT NULL,

            item TEXT NOT NULL,

            category TEXT,

            amount REAL NOT NULL,

            notes TEXT,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(account_id)
                REFERENCES accounts(id)
        )
    `).run();


    // ======================================================
    // INCOME
    // ======================================================

    db.prepare(`
        CREATE TABLE IF NOT EXISTS income (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            account_id INTEGER NOT NULL,

            source TEXT,

            amount REAL NOT NULL,

            notes TEXT,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(account_id)
                REFERENCES accounts(id)
        )
    `).run();


    // ======================================================
    // PERSONAL SAVINGS GOALS
    // ======================================================

    db.prepare(`
        CREATE TABLE IF NOT EXISTS personal_savings_goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            account_id INTEGER NOT NULL,

            name TEXT NOT NULL,

            target_amount REAL NOT NULL,

            saved_amount REAL DEFAULT 0,

            deadline TEXT,

            notes TEXT,

            status TEXT DEFAULT 'ACTIVE',

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(account_id)
                REFERENCES accounts(id)
        )
    `).run();


    // ======================================================
    // DEBTORS
    // ======================================================

    db.prepare(`
        CREATE TABLE IF NOT EXISTS debtors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            account_id INTEGER NOT NULL,

            customer_id INTEGER NOT NULL,

            sale_id INTEGER NOT NULL,

            total_amount REAL NOT NULL,

            amount_paid REAL DEFAULT 0,

            balance REAL NOT NULL,

            status TEXT DEFAULT 'UNPAID',

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(account_id)
                REFERENCES accounts(id),

            FOREIGN KEY(customer_id)
                REFERENCES customers(id),

            FOREIGN KEY(sale_id)
                REFERENCES sales(id)
        )
    `).run();


    // ======================================================
    // PURCHASES
    // ======================================================

    db.prepare(`
        CREATE TABLE IF NOT EXISTS purchases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            account_id INTEGER NOT NULL,

            supplier_id INTEGER NOT NULL,

            inventory_id INTEGER NOT NULL,

            quantity INTEGER NOT NULL,

            unit_cost REAL NOT NULL,

            total_amount REAL NOT NULL,

            payment_status TEXT DEFAULT 'PAID',

            amount_paid REAL DEFAULT 0,

            balance REAL DEFAULT 0,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(account_id)
                REFERENCES accounts(id),

            FOREIGN KEY(supplier_id)
                REFERENCES suppliers(id),

            FOREIGN KEY(inventory_id)
                REFERENCES inventory(id)
        )
    `).run();


    // ======================================================
    // CREDITORS
    // ======================================================

    db.prepare(`
        CREATE TABLE IF NOT EXISTS creditors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            account_id INTEGER NOT NULL,

            supplier_id INTEGER NOT NULL,

            purchase_id INTEGER NOT NULL,

            total_amount REAL NOT NULL,

            amount_paid REAL DEFAULT 0,

            balance REAL NOT NULL,

            status TEXT DEFAULT 'UNPAID',

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(account_id)
                REFERENCES accounts(id),

            FOREIGN KEY(supplier_id)
                REFERENCES suppliers(id),

            FOREIGN KEY(purchase_id)
                REFERENCES purchases(id)
        )
    `).run();


    // ======================================================
    // INDEXES
    // ======================================================

    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_accounts_owner
        ON accounts(owner_user_id)
    `).run();


    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_accounts_type
        ON accounts(account_type)
    `).run();


    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_account_members_user
        ON account_members(user_id)
    `).run();


    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_account_members_account
        ON account_members(account_id)
    `).run();


    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_current_accounts_user
        ON user_current_accounts(user_id)
    `).run();


    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_current_accounts_account
        ON user_current_accounts(account_id)
    `).run();


    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_customers_account
        ON customers(account_id)
    `).run();


    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_suppliers_account
        ON suppliers(account_id)
    `).run();


    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_inventory_account
        ON inventory(account_id)
    `).run();


    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_sales_account
        ON sales(account_id)
    `).run();


    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_expenses_account
        ON expenses(account_id)
    `).run();


    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_income_account
        ON income(account_id)
    `).run();


    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_personal_savings_goals_account
        ON personal_savings_goals(account_id)
    `).run();


    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_debtors_account
        ON debtors(account_id)
    `).run();


    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_purchases_account
        ON purchases(account_id)
    `).run();


    db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_creditors_account
        ON creditors(account_id)
    `).run();


    // ======================================================
    // DATABASE READY
    // ======================================================

    console.log(
        "✅ Database initialized successfully."
    );
}

module.exports = initializeDatabase;