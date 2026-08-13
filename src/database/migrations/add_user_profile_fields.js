const db = require("../database");

function runMigration() {
    const columns = db.prepare(`
        PRAGMA table_info(users)
    `).all();

    const existingColumns = columns.map(
        column => column.name
    );

    if (!existingColumns.includes("email")) {
        db.prepare(`
            ALTER TABLE users
            ADD COLUMN email TEXT
        `).run();

        console.log("✅ Added users.email");
    } else {
        console.log("ℹ️ users.email already exists");
    }

    if (!existingColumns.includes("phone")) {
        db.prepare(`
            ALTER TABLE users
            ADD COLUMN phone TEXT
        `).run();

        console.log("✅ Added users.phone");
    } else {
        console.log("ℹ️ users.phone already exists");
    }

    console.log("✅ User profile migration completed.");
}

runMigration();