const accountContext = require("./accountContext");
const supplierRepository = require("../repositories/supplierRepository");

// ==========================
// GET CURRENT ACCOUNT
// ==========================
function getAccount(telegramId) {

    return accountContext.requireAccount(
        telegramId
    );

}

// ==========================
// SAVE SUPPLIER
// ==========================
function saveSupplier(
    telegramId,
    supplier
) {

    const account =
        getAccount(telegramId);

    return supplierRepository.create({

        accountId:
            account.accountId,

        name:
            supplier.name,

        phone:
            supplier.phone,

        email:
            supplier.email,

        address:
            supplier.address

    });

}

// ==========================
// GET ALL SUPPLIERS
// ==========================
function getSuppliers(telegramId) {

    const account =
        getAccount(telegramId);

    return supplierRepository.findAll(
        account.accountId
    );

}

// ==========================
// SEARCH SUPPLIERS
// ==========================
function searchSuppliers(
    telegramId,
    keyword
) {

    const account =
        getAccount(telegramId);

    return supplierRepository.search(

        account.accountId,

        keyword

    );

}

// ==========================
// FIND SUPPLIER BY NAME
// ==========================
function findSupplierByName(
    telegramId,
    name
) {

    const account =
        getAccount(telegramId);

    return supplierRepository.findByName(

        account.accountId,

        name

    );

}

// ==========================
// FIND OR CREATE SUPPLIER
// ==========================
function findOrCreateSupplier(
    telegramId,
    name
) {

    const supplier =
        findSupplierByName(
            telegramId,
            name
        );

    if (supplier) {

        return supplier;

    }

    return saveSupplier(
        telegramId,
        {

            name,

            phone: "",

            email: "",

            address: ""

        }
    );

}

module.exports = {

    saveSupplier,

    getSuppliers,

    searchSuppliers,

    findSupplierByName,

    findOrCreateSupplier

};