module.exports = {

    id: 6,

    name: "Enforce One Active Subscription Per Account",

    up(db) {

        // ==================================================
        // PREVENT MULTIPLE ACTIVE SUBSCRIPTIONS
        // ==================================================
        //
        // Each account may have only ONE ACTIVE
        // subscription at any given time.
        //
        // Subscription ownership remains ACCOUNT-based.
        //
        // Example:
        //
        // Account 1 → PRO → ACTIVE
        // Account 2 → FREE → ACTIVE
        //
        // Account 1 cannot simultaneously have:
        //
        // PRO → ACTIVE
        // BUSINESS → ACTIVE
        //
        // ==================================================

        db.prepare(`
            CREATE UNIQUE INDEX IF NOT EXISTS
            idx_one_active_subscription_per_account

            ON subscriptions(account_id)

            WHERE status = 'ACTIVE'
        `).run();

        console.log(
            "✅ One active subscription per account enforced."
        );
    }

};