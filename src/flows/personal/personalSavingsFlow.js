const {
    getSession,
    setSession,
    clearSession
} = require("../../states/sessionManager");

const STATES =
    require("../../constants/states");

const personalSavingsApplication =
    require("../../application/personal/personalSavings");

const personalSavingsKeyboard =
    require("../../keyboards/personal/personalSavingsKeyboard");

const personalKeyboard =
    require("../../keyboards/personal/personalKeyboard");

const accountContext =
    require("../../services/accountContext");


// ======================================================
// PERSONAL SAVINGS FLOW
// ======================================================
//
// TELEGRAM INTERFACE LAYER
//
// Telegram
//    ↓
// Personal Savings Flow
//    ↓
// Application
//    ↓
// Service
//    ↓
// Repository
//    ↓
// Database
//
// ======================================================


// ======================================================
// GET CURRENT ACCOUNT ID
// ======================================================

function getAccountId(telegramId) {

    const account =
        accountContext.getCurrentAccount(
            telegramId
        );


    if (!account) {

        throw new Error(
            "ACCOUNT_NOT_FOUND"
        );

    }


    // IMPORTANT:
    //
    // accountContext returns:
    //
    // accountId
    // accountName
    // accountType
    //
    // NOT account.id

    return account.accountId;

}


// ======================================================
// PERSONAL SAVINGS FLOW
// ======================================================

module.exports = async function personalSavingsFlow(ctx) {

    const telegramId =
        ctx.from &&
        ctx.from.id
            ? ctx.from.id
            : null;


    if (!telegramId) {

        return;

    }


    const text =
        ctx.message &&
        ctx.message.text
            ? ctx.message.text.trim()
            : "";


    if (!text) {

        return;

    }


    // ==================================================
    // GET CURRENT SESSION
    // ==================================================

    const session =
        getSession(
            telegramId
        );


    if (!session) {

        await ctx.reply(

            "⚠️ Your savings session has expired.\n\n" +
            "Please select Savings again.",

            personalKeyboard

        );

        return;

    }


    // ==================================================
    // GET CURRENT PERSONAL ACCOUNT
    // ==================================================

    let accountId;

    try {

        accountId =
            getAccountId(
                telegramId
            );

    } catch (error) {

        console.error(
            "Personal savings account error:",
            error
        );


        clearSession(
            telegramId
        );


        await ctx.reply(

            "⚠️ I could not find your personal account.\n\n" +
            "Please return to the Personal Finance menu.",

            personalKeyboard

        );

        return;

    }


    // ==================================================
    // CANCEL / BACK
    // ==================================================

    if (
        text === "⬅️ Back" ||
        text === "⬅️ Back to Main Menu" ||
        text === "🔙 Back to Main Menu"
    ) {

        clearSession(
            telegramId
        );


        await ctx.reply(

            "👤 PERSONAL FINANCE\n\n" +
            "Choose an option below 👇",

            personalKeyboard

        );

        return;

    }


    // ==================================================
    // SESSION ROUTING
    // ==================================================

    switch (session.state) {


        // ==============================================
        // SAVING GOAL NAME
        // ==============================================

        case STATES.WAITING_FOR_PERSONAL_SAVING_NAME: {

            const name =
                text.trim();


            if (!name) {

                await ctx.reply(

                    "⚠️ Please enter a name for your savings goal."

                );

                return;

            }


            setSession(

                telegramId,

                {

                    state:
                        STATES.WAITING_FOR_PERSONAL_SAVING_AMOUNT,

                    data: {

                        ...(session.data || {}),

                        name

                    }

                }

            );


            await ctx.reply(

                "🎯 SAVINGS GOAL\n\n" +
                "How much do you want to save for this goal?\n\n" +
                "Example: 500000"

            );

            return;

        }


        // ==============================================
        // SAVING TARGET AMOUNT
        // ==============================================

        case STATES.WAITING_FOR_PERSONAL_SAVING_AMOUNT: {

            const amount =
                Number(
                    text.replace(
                        /[,₦\s]/g,
                        ""
                    )
                );


            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                await ctx.reply(

                    "⚠️ Please enter a valid savings amount.\n\n" +
                    "Example: 500000"

                );

                return;

            }


            setSession(

                telegramId,

                {

                    state:
                        STATES.WAITING_FOR_PERSONAL_SAVING_NOTE,

                    data: {

                        ...(session.data || {}),

                        targetAmount:
                            amount

                    }

                }

            );


            await ctx.reply(

                "📝 SAVINGS NOTE\n\n" +
                "Add a note for this savings goal.\n\n" +
                "Or type \"None\" if you don't want to add a note."

            );

            return;

        }


        // ==============================================
        // SAVING NOTE
        // ==============================================

        case STATES.WAITING_FOR_PERSONAL_SAVING_NOTE: {

            const data =
                session.data || {};


            // ------------------------------------------
            // VALIDATE SAVINGS NAME
            // ------------------------------------------

            if (
                !data.name ||
                !String(data.name).trim()
            ) {

                clearSession(
                    telegramId
                );


                await ctx.reply(

                    "⚠️ Your savings goal name is missing.\n\n" +
                    "Please start again.",

                    personalKeyboard

                );

                return;

            }


            // ------------------------------------------
            // VALIDATE TARGET AMOUNT
            // ------------------------------------------

            if (
                !data.targetAmount ||
                Number(data.targetAmount) <= 0
            ) {

                clearSession(
                    telegramId
                );


                await ctx.reply(

                    "⚠️ Your savings target is missing.\n\n" +
                    "Please start again.",

                    personalKeyboard

                );

                return;

            }


            // ------------------------------------------
            // PROCESS NOTE
            // ------------------------------------------

            let note =
                text.trim();


            if (
                !note ||
                note.toLowerCase() === "none"
            ) {

                note = null;

            }


            // ------------------------------------------
            // CREATE SAVINGS GOAL
            // ------------------------------------------

            try {

                console.log(
                    "Creating personal savings goal:",
                    {
                        accountId,
                        name: data.name,
                        targetAmount:
                            Number(data.targetAmount),
                        note
                    }
                );


                const goal =
                    personalSavingsApplication.createSavingsGoal(

                        accountId,

                        {

                            name:
                                String(
                                    data.name
                                ).trim(),

                            targetAmount:
                                Number(
                                    data.targetAmount
                                ),

                            note

                        }

                    );


                // --------------------------------------
                // CLEAR SESSION
                // --------------------------------------

                clearSession(
                    telegramId
                );


                // --------------------------------------
                // GET TARGET AMOUNT
                // --------------------------------------

                const target =
                    Number(
                        goal &&
                        (
                            goal.target_amount ||
                            goal.targetAmount
                        )
                            ? (
                                goal.target_amount ||
                                goal.targetAmount
                            )
                            : data.targetAmount
                    );


                // --------------------------------------
                // SUCCESS RESPONSE
                // --------------------------------------

                await ctx.reply(

                    "✅ SAVINGS GOAL CREATED\n\n" +

                    "🎯 Goal: " +
                    data.name +
                    "\n\n" +

                    "💰 Target: ₦" +
                    target.toLocaleString() +
                    "\n\n" +

                    "Your savings goal has been created successfully.",

                    personalSavingsKeyboard

                );

                return;

            } catch (error) {

                console.error(
                    "Personal savings creation error:",
                    error
                );


                clearSession(
                    telegramId
                );


                await ctx.reply(

                    "❌ I could not create your savings goal.\n\n" +
                    "Please try again.",

                    personalSavingsKeyboard

                );

                return;

            }

        }


        // ==============================================
        // UNKNOWN SAVINGS SESSION
        // ==============================================

        default: {

            clearSession(
                telegramId
            );


            await ctx.reply(

                "⚠️ Your savings session is no longer valid.\n\n" +
                "Please start the Savings option again.",

                personalKeyboard

            );

            return;

        }

    }

};