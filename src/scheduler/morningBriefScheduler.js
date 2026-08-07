const cron = require("node-cron");

const notificationRepository = require("../repositories/notificationRepository");
const notificationService = require("../services/notificationService");

// ==========================
// MORNING BRIEF SCHEDULER
// ==========================
function startMorningBriefScheduler() {

    const schedule =
        process.env.MORNING_BRIEF_CRON || "0 8 * * *";

    console.log("🌅 Morning Brief Scheduler started.");
    console.log(`⏰ Schedule: ${schedule}`);

    cron.schedule(schedule, async () => {

        console.log("📨 Running Morning Brief Scheduler...");

        const users =
            notificationRepository.getMorningBriefUsers();

        console.log(`👥 ${users.length} user(s) found.`);

        for (const user of users) {

            try {

                await notificationService.sendMorningBrief(user);

                console.log(
                    `✅ Morning Brief sent to ${user.business_name}`
                );

            } catch (error) {

                console.error(

                    `❌ Failed to send Morning Brief to ${user.business_name}`,

                    error

                );

            }

        }

    });

}

module.exports = {

    startMorningBriefScheduler

};