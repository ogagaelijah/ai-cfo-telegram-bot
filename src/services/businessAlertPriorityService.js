// ==========================
// ALERT PRIORITY
// ==========================
const PRIORITY = {

    CRITICAL: 1,

    WARNING: 2,

    INFO: 3

};

// ==========================
// SORT ALERTS
// ==========================
function prioritizeAlerts(alerts = []) {

    return [...alerts].sort((a, b) => {

        return PRIORITY[a.level] - PRIORITY[b.level];

    });

}

module.exports = {

    prioritizeAlerts

};