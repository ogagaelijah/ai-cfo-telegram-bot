function currentDate() {

    return new Date().toISOString();

}

function currentDateOnly() {

    return new Date().toISOString().split("T")[0];

}

function formatDate(date) {

    return new Date(date).toLocaleDateString("en-NG");

}

module.exports = {

    currentDate,
    currentDateOnly,
    formatDate

};