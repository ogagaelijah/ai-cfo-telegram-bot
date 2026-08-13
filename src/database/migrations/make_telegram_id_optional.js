const db = require("../database");


// ======================================================
// MIGRATION
// ======================================================
//
// Make users.telegram_id optional.
//
// AI CFO supports multiple interfaces:
//
// Telegram
// Web
// WhatsApp
// Mobile
// API
//
// Therefore Telegram identity must NOT be mandatory.
//
// Existing users and all existing relationships must
// remain intact.
//
// ======================================================


function migrate() {

    // ==================================================
    // CHECK CURRENT STRUCTURE
    // ==================================================

    const columns =
        db.prepare(
            "PRAGMA table_info(users)"
        ).all();


    const telegramColumn =
        columns.find(
            column =>
                column.name === "telegram_id"
        );


    // ==================================================
    // ALREADY MIGRATED
    // ==================================================

    if (
        telegramColumn &&
        telegramColumn.notnull === 0
    ) {

        console.log(
            "✅ users.telegram_id is already optional."
        );

        return;

    }


    if (!telegramColumn) {

        throw new Error(
            "users.telegram_id column was not found."
        );

    }


    // ==================================================
    // DISABLE FOREIGN KEY CHECKING TEMPORARILY
    // ==================================================
    //
    // SQLite does not allow us to safely drop and rebuild
    // a referenced table while foreign-key enforcement is
    // active.
    //
    // We restore it immediately after the migration.
    //
    // ==================================================

    db.pragma(
        "foreign_keys = OFF"
    );


    try {

        // ==================================================
        // MIGRATION TRANSACTION
        // ==================================================

        const migrateUsers =
            db.transaction(() => {

                // ==========================================
                // CREATE NEW USERS TABLE
                // ==========================================

                db.prepare(`
                    CREATE TABLE users_new (

                        id INTEGER PRIMARY KEY AUTOINCREMENT,

                        telegram_id INTEGER UNIQUE,

                        full_name TEXT NOT NULL,

                        username TEXT,

                        created_at TEXT DEFAULT CURRENT_TIMESTAMP,

                        morning_brief_enabled INTEGER DEFAULT 1,

                        evening_report_enabled INTEGER DEFAULT 1,

                        weekly_report_enabled INTEGER DEFAULT 1,

                        monthly_report_enabled INTEGER DEFAULT 1,

                        notification_time TEXT DEFAULT '08:00',

                        timezone TEXT DEFAULT 'Africa/Lagos',

                        email TEXT,

                        phone TEXT

                    )
                `).run();


                // ==========================================
                // COPY EXISTING USERS
                // ==========================================

                db.prepare(`
                    INSERT INTO users_new
                    (
                        id,
                        telegram_id,
                        full_name,
                        username,
                        created_at,
                        morning_brief_enabled,
                        evening_report_enabled,
                        weekly_report_enabled,
                        monthly_report_enabled,
                        notification_time,
                        timezone,
                        email,
                        phone
                    )

                    SELECT
                        id,
                        telegram_id,
                        full_name,
                        username,
                        created_at,
                        morning_brief_enabled,
                        evening_report_enabled,
                        weekly_report_enabled,
                        monthly_report_enabled,
                        notification_time,
                        timezone,
                        email,
                        phone

                    FROM users
                `).run();


                // ==========================================
                // DROP OLD USERS TABLE
                // ==========================================

                db.prepare(`
                    DROP TABLE users
                `).run();


                // ==========================================
                // RENAME NEW TABLE
                // ==========================================

                db.prepare(`
                    ALTER TABLE users_new
                    RENAME TO users
                `).run();

            });


        // ==============================================
        // EXECUTE TRANSACTION
        // ==============================================

        migrateUsers();


        // ==================================================
        // RESTORE FOREIGN KEY ENFORCEMENT
        // ==================================================

        db.pragma(
            "foreign_keys = ON"
        );


        // ==================================================
        // VERIFY FOREIGN KEYS
        // ==================================================

        const foreignKeyCheck =
            db.prepare(
                "PRAGMA foreign_key_check"
            ).all();


        if (
            foreignKeyCheck.length > 0
        ) {

            throw new Error(
                "Foreign key verification failed after migration."
            );

        }


        console.log(
            "✅ users.telegram_id is now optional."
        );

        console.log(
            "✅ Existing user records were preserved."
        );

        console.log(
            "✅ Foreign key relationships remain valid."
        );

    } catch (error) {

        // ==================================================
        // ALWAYS RESTORE FOREIGN KEYS
        // ==================================================

        db.pragma(
            "foreign_keys = ON"
        );


        throw error;

    }

}


// ======================================================
// RUN MIGRATION
// ======================================================

try {

    migrate();

} catch (error) {

    console.error(
        "❌ User identity migration failed."
    );

    console.error(
        error
    );

    process.exit(1);

}