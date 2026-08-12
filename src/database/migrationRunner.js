const db = require("./database");

const migrations = [
    require("./migrations/001_initial_schema"),
    require("./migrations/002_update_sales_table"),
    require("./migrations/003_add_notification_settings"),
    require("./migrations/004_add_account_type"),
    require("./migrations/005_add_subscription_system"),
    require("./migrations/006_enforce_account_subscription"),
    require("./migrations/007_seed_plan_features"),
    require("./migrations/008_feature_usage")
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