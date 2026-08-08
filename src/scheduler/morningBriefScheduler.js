const cron = require("node-cron");

const notificationRepository = require("../repositories/notificationRepository");
const notificationService = require("../services/notificationService");

// ==========================
// MORNING BRIEF SCHEDULER
// ==========================
function startMorningBriefScheduler() {

    const schedule =
        process.env.MORNING_BRIEF_CRON || "0 8 * * *";

    console.log("");
    console.log("======================================");
    console.log("🌅 Morning Brief Scheduler started.");
    console.log("📌 ENV VALUE:", process.env.MORNING_BRIEF_CRON);
    console.log("⏰ ACTUAL SCHEDULE:", schedule);
    console.log("======================================");

    cron.schedule(schedule, async () => {

        console.log("");
        console.log("======================================");
        console.log("📨 Running Morning Brief Scheduler...");
        console.log("======================================");

        const users =
            notificationRepository.getMorningBriefUsers();

        console.log(`👥 ${users.length} user(s) found.`);

        if (users.length === 0) {

            console.log("ℹ️ No users have Morning Brief enabled.");

            return;

        }

        for (const user of users) {

            try {

                console.log(
                    `📤 Sending Morning Brief to ${user.business_name}...`
                );

                await notificationService.sendMorningBrief(user);

                console.log(
                    `✅ Successfully sent to ${user.business_name}`
                );

            } catch (error) {

                console.error(
                    `❌ Failed for ${user.business_name}`
                );

                console.error(error);

            }

        }

        console.log("======================================");
        console.log("✅ Morning Brief cycle completed.");
        console.log("======================================");

    });

}

module.exports = {

    startMorningBriefScheduler

};