const {
    register,
    ACCOUNT_TYPES
} = require("../services/registrationService");

const {
    getSession,
    setSession,
    clearSession
} = require("../states/sessionManager");


// ======================================================
// REGISTRATION FLOW
// ======================================================
//
// Telegram-specific onboarding controller.
//
// IMPORTANT:
//
// This file handles the conversation with the user.
//
// It does NOT contain the database registration logic.
//
// The actual registration is performed by:
//
// registrationService.register()
//
// This keeps the registration engine interface-neutral.
//
// ======================================================


// ======================================================
// REGISTRATION STATES
// ======================================================

const REGISTRATION_STATES = {

    WAITING_FOR_FULL_NAME:
        "REGISTRATION_WAITING_FOR_FULL_NAME",

    WAITING_FOR_EMAIL:
        "REGISTRATION_WAITING_FOR_EMAIL",

    WAITING_FOR_PHONE:
        "REGISTRATION_WAITING_FOR_PHONE",

    WAITING_FOR_ACCOUNT_NAME:
        "REGISTRATION_WAITING_FOR_ACCOUNT_NAME",

    WAITING_FOR_ACCOUNT_TYPE:
        "REGISTRATION_WAITING_FOR_ACCOUNT_TYPE",

    CONFIRMING:
        "REGISTRATION_CONFIRMING"

};


// ======================================================
// START REGISTRATION
// ======================================================

async function startRegistration(ctx) {

    const telegramUser =
        ctx.from;


    setSession(

        telegramUser.id,

        {

            state:
                REGISTRATION_STATES.WAITING_FOR_FULL_NAME,

            registration: {

                telegramId:
                    telegramUser.id,

                username:
                    telegramUser.username || null,

                fullName:
                    "",

                email:
                    "",

                phone:
                    "",

                accountName:
                    "",

                accountType:
                    ACCOUNT_TYPES.BUSINESS

            }

        }

    );


    await ctx.reply(

        `🚀 Let's get your AI CFO account set up.

What is your full name?`

    );

}


// ======================================================
// HANDLE REGISTRATION
// ======================================================

async function handleRegistration(ctx) {

    const telegramUser =
        ctx.from;


    const session =
        getSession(
            telegramUser.id
        );


    if (!session) {

        return false;

    }


    if (
        !session.state ||
        !session.state.startsWith(
            "REGISTRATION_"
        )
    ) {

        return false;

    }


    const text =
        String(
            ctx.message?.text || ""
        ).trim();


    if (!text) {

        await ctx.reply(
            "Please enter a valid response."
        );

        return true;

    }


    // ==================================================
    // FULL NAME
    // ==================================================

    if (
        session.state ===
        REGISTRATION_STATES.WAITING_FOR_FULL_NAME
    ) {

        if (text.length < 2) {

            await ctx.reply(
                "Please enter your full name."
            );

            return true;

        }


        session.registration.fullName =
            text;


        session.state =
            REGISTRATION_STATES.WAITING_FOR_EMAIL;


        setSession(
            telegramUser.id,
            session
        );


        await ctx.reply(
            `Thanks, ${text}.

📧 What is your email address?`
        );


        return true;

    }


    // ==================================================
    // EMAIL
    // ==================================================

    if (
        session.state ===
        REGISTRATION_STATES.WAITING_FOR_EMAIL
    ) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(
                text.toLowerCase()
            )
        ) {

            await ctx.reply(
                "Please enter a valid email address."
            );

            return true;

        }


        session.registration.email =
            text.toLowerCase();


        session.state =
            REGISTRATION_STATES.WAITING_FOR_PHONE;


        setSession(
            telegramUser.id,
            session
        );


        await ctx.reply(
            `📱 What is your phone number?

Example:
+2348012345678`
        );


        return true;

    }


    // ==================================================
    // PHONE
    // ==================================================

    if (
        session.state ===
        REGISTRATION_STATES.WAITING_FOR_PHONE
    ) {

        const phone =
            text.replace(
                /[\s()-]/g,
                ""
            );


        if (
            !/^\+?[0-9]{7,15}$/.test(
                phone
            )
        ) {

            await ctx.reply(
                "Please enter a valid phone number."
            );

            return true;

        }


        session.registration.phone =
            text;


        session.state =
            REGISTRATION_STATES.WAITING_FOR_ACCOUNT_NAME;


        setSession(
            telegramUser.id,
            session
        );


        await ctx.reply(
            `🏢 What would you like to call your business or account?

Example:
Ogaga Enterprises`
        );


        return true;

    }


    // ==================================================
    // ACCOUNT NAME
    // ==================================================

    if (
        session.state ===
        REGISTRATION_STATES.WAITING_FOR_ACCOUNT_NAME
    ) {

        if (text.length < 2) {

            await ctx.reply(
                "Please enter a valid business or account name."
            );

            return true;

        }


        session.registration.accountName =
            text;


        session.state =
            REGISTRATION_STATES.WAITING_FOR_ACCOUNT_TYPE;


        setSession(
            telegramUser.id,
            session
        );


        await ctx.reply(

            `📂 What type of account is this?

Reply with:

🏢 BUSINESS

or

👤 PERSONAL`

        );


        return true;

    }


    // ==================================================
    // ACCOUNT TYPE
    // ==================================================

    if (
        session.state ===
        REGISTRATION_STATES.WAITING_FOR_ACCOUNT_TYPE
    ) {

        const normalized =
            text
                .toUpperCase()
                .replace(
                    /[^A-Z]/g,
                    ""
                );


        let accountType;


        if (
            normalized === "BUSINESS"
        ) {

            accountType =
                ACCOUNT_TYPES.BUSINESS;

        }
        else if (
            normalized === "PERSONAL"
        ) {

            accountType =
                ACCOUNT_TYPES.PERSONAL;

        }
        else {

            await ctx.reply(
                `Please choose one of these:

🏢 BUSINESS

👤 PERSONAL`
            );

            return true;

        }


        session.registration.accountType =
            accountType;


        session.state =
            REGISTRATION_STATES.CONFIRMING;


        setSession(
            telegramUser.id,
            session
        );


        const registration =
            session.registration;


        await ctx.reply(

            `📋 Please confirm your registration.

👤 Name:
${registration.fullName}

📧 Email:
${registration.email}

📱 Phone:
${registration.phone}

🏢 Account:
${registration.accountName}

📂 Type:
${registration.accountType}

Reply:

✅ CONFIRM

or

❌ CANCEL`

        );


        return true;

    }


    // ==================================================
    // CONFIRMATION
    // ==================================================

    if (
        session.state ===
        REGISTRATION_STATES.CONFIRMING
    ) {

        const command =
            text.toUpperCase();


        // ==============================================
        // CANCEL
        // ==============================================

        if (
            command === "CANCEL"
            ||
            command === "❌"
        ) {

            clearSession(
                telegramUser.id
            );


            await ctx.reply(
                `Registration cancelled.

You can start again anytime with /start.`
            );


            return true;

        }


        // ==============================================
        // CONFIRM
        // ==============================================

        if (
            command !== "CONFIRM"
            &&
            command !== "✅"
        ) {

            await ctx.reply(
                `Please reply:

✅ CONFIRM

or

❌ CANCEL`
            );

            return true;

        }


        // ==============================================
        // PERFORM REGISTRATION
        // ==============================================

        try {

            const result =
                register(
                    session.registration
                );


            // ==========================================
            // CLEAR REGISTRATION SESSION
            // ==========================================

            clearSession(
                telegramUser.id
            );


            // ==========================================
            // SUCCESS
            // ==========================================

            await ctx.reply(

                `🎉 Registration successful!

Welcome to AI CFO, ${result.user.fullName}.

🏢 Account:
${result.account.name}

📂 Type:
${result.account.type}

👤 Role:
${result.membership.role}

Your CFO account is now ready.

Choose an option from the menu below 👇`

            );


            return true;

        }
        catch (error) {

            // ==========================================
            // DUPLICATE USER
            // ==========================================

            if (
                error.code ===
                "USER_ALREADY_EXISTS"
            ) {

                clearSession(
                    telegramUser.id
                );


                await ctx.reply(

                    `⚠️ An account already exists for this email or Telegram account.

If you already have an AI CFO account, please use your existing account.

If you believe this is an error, contact support.`

                );


                return true;

            }


            // ==========================================
            // VALIDATION ERROR
            // ==========================================

            await ctx.reply(

                `❌ Registration could not be completed.

${error.message || "An unexpected error occurred."}

Please try again.`

            );


            return true;

        }

    }


    return false;

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    REGISTRATION_STATES,

    startRegistration,

    handleRegistration

};