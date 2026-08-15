const db = require("../database");

// ======================================================
// MIGRATION: PERSONAL DEBTS
// ======================================================
//
// Creates the personal_debts table for existing databases.
//
// Safe to run multiple times.
// Existing data is not deleted or modified.
//
// ======================================================

function migrate() {

    db.exec(`
        CREATE TABLE IF NOT EXISTS personal_debts (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            account_id INTEGER NOT NULL,

            name TEXT NOT NULL,

            original_amount REAL NOT NULL,

            paid_amount REAL NOT NULL DEFAULT 0,

            remaining_amount REAL NOT NULL,

            due_date TEXT,

            notes TEXT DEFAULT '',

            status TEXT NOT NULL DEFAULT 'ACTIVE',

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (
                account_id
            )
            REFERENCES accounts(id)

            ON DELETE CASCADE

        );
    `);


    db.exec(`
        CREATE INDEX IF NOT EXISTS
        idx_personal_debts_account

        ON personal_debts(account_id);
    `);


    console.log(
        "✅ Personal debts migration completed."
    );

}


// ======================================================
// RUN MIGRATION
// ======================================================

try {

    migrate();

} catch (error) {

    console.error(
        "❌ Personal debts migration failed:",
        error
    );

    process.exitCode = 1;

}