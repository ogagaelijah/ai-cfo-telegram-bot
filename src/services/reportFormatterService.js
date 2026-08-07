const {
    buildExecutiveBrief
} = require("./executiveBriefBuilder");

// ==========================
// FORMAT MORNING BRIEF
// ==========================
function formatMorningBrief(report) {

    return buildExecutiveBrief(report);

}

module.exports = {

    formatMorningBrief

};