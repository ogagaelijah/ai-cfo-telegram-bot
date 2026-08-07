const {
    buildBusinessSnapshotSection
} = require("./executiveSections/businessSnapshotSection");

const {
    buildCashStatusSection
} = require("./executiveSections/cashStatusSection");

const {
    buildObservationSection
} = require("./executiveSections/observationSection");

const {
    buildRecommendationSection
} = require("./executiveSections/recommendationSection");

const {
    buildInventorySection
} = require("./executiveSections/inventorySection");

const {
    buildAlertsSection
} = require("./executiveSections/alertsSection");

const {
    buildFooterSection
} = require("./executiveSections/footerSection");

// ==========================
// BUILD EXECUTIVE BRIEF
// ==========================
function buildExecutiveBrief(report) {

    console.log("🚀 USING NEW EXECUTIVE BRIEF BUILDER");

    return `🌅 GOOD MORNING

━━━━━━━━━━━━━━━━━━

👔 AI CFO EXECUTIVE BRIEF

━━━━━━━━━━━━━━━━━━

${buildBusinessSnapshotSection(report)}

━━━━━━━━━━━━━━━━━━

${buildCashStatusSection(report)}

━━━━━━━━━━━━━━━━━━

${buildObservationSection(report)}

━━━━━━━━━━━━━━━━━━

${buildRecommendationSection(report)}

━━━━━━━━━━━━━━━━━━

${buildInventorySection(report)}

━━━━━━━━━━━━━━━━━━

${buildAlertsSection(report)}

${buildFooterSection(report)}`;

}

module.exports = {

    buildExecutiveBrief

};