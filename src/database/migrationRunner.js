const db = require("./database");

const migrations = [
    require("./migrations/001_initial_schema"),
    require("./migrations/002_update_sales_table")
];

function runMigrations() {

    db.prepare(`
        CREATE TABLE IF NOT EXISTS migrations (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            executed_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `).run();

    migrations.forEach((migration) => {

        const exists = db.prepare(`
            SELECT id
            FROM migrations
            WHERE id = ?
        `).get(migration.id);

        if (exists) {
            return;
        }

        console.log(`🚀 Running Migration ${migration.id}: ${migration.name}`);

        migration.up(db);

        db.prepare(`
            INSERT INTO migrations (
                id,
                name
            )
            VALUES (?, ?)
        `).run(
            migration.id,
            migration.name
        );

        console.log(`✅ Migration ${migration.id} completed.`);

    });

}

module.exports = runMigrations;