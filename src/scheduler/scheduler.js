const {
    startMorningBriefScheduler
} = require("./morningBriefScheduler");

// ==========================
// START ALL SCHEDULERS
// ==========================
function startSchedulers() {

    console.log("");

    console.log("======================================");
    console.log("⏰ Starting AI CFO Schedulers...");
    console.log("======================================");

    startMorningBriefScheduler();

    console.log("======================================");
    console.log("✅ All schedulers started.");
    console.log("======================================");

}

module.exports = {

    startSchedulers

};