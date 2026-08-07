module.exports = {

    id: 3,

    name: "Add Notification Settings",

    up(db) {

        const columns = db.prepare(`
            PRAGMA table_info(users)
        `).all();

        const exists = (column) =>
            columns.some(c => c.name === column);

        if (!exists("morning_brief_enabled")) {

            db.prepare(`
                ALTER TABLE users
                ADD COLUMN morning_brief_enabled
                INTEGER DEFAULT 1
            `).run();

            console.log("✅ Added morning_brief_enabled.");

        }

        if (!exists("evening_report_enabled")) {

            db.prepare(`
                ALTER TABLE users
                ADD COLUMN evening_report_enabled
                INTEGER DEFAULT 1
            `).run();

            console.log("✅ Added evening_report_enabled.");

        }

        if (!exists("weekly_report_enabled")) {

            db.prepare(`
                ALTER TABLE users
                ADD COLUMN weekly_report_enabled
                INTEGER DEFAULT 1
            `).run();

            console.log("✅ Added weekly_report_enabled.");

        }

        if (!exists("monthly_report_enabled")) {

            db.prepare(`
                ALTER TABLE users
                ADD COLUMN monthly_report_enabled
                INTEGER DEFAULT 1
            `).run();

            console.log("✅ Added monthly_report_enabled.");

        }

        if (!exists("notification_time")) {

            db.prepare(`
                ALTER TABLE users
                ADD COLUMN notification_time
                TEXT DEFAULT '08:00'
            `).run();

            console.log("✅ Added notification_time.");

        }

        if (!exists("timezone")) {

            db.prepare(`
                ALTER TABLE users
                ADD COLUMN timezone
                TEXT DEFAULT 'Africa/Lagos'
            `).run();

            console.log("✅ Added timezone.");

        }

    }

};