const db = require("./src/database/database");

const result = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
    AND name = 'personal_debtors'
`).get();

console.log(result);