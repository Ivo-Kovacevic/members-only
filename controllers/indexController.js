const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { validationResult } = require("express-validator");
const { validateNewUser } = require("../validation/user-validation");

const indexGet = async (req, res) => {
    const messages = await db.getAllMessages();
    res.render("index", { messages });
};

const registerGet = async (req, res) => {
    res.render("register");
};

const registerPost = [
    validateNewUser,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).render("register", {
                    errors: errors.array(),
                    userData: req.body,
                });
            }
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                const newUser = await db.insertUser(
                    req.body.username,
                    hashedPassword
                );
                req.logIn(newUser, (err) => {
                    if (err) {
                        return next(err);
                    }
                    return res.redirect("/");
                });
            });
        } catch (err) {
            return next(err);
        }
    },
];

const loginGet = async (req, res) => {
    res.render("login");
};

const loginPost = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render("login", {
                messageUsername: info.messageUsername,
                messagePassword: info.messagePassword,
                userData: req.body,
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect("/");
        });
    })(req, res, next);
};

const logoutGet = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};

const addMessageGet = async (req, res) => {
    res.render("add-message");
};

const addMessagePost = async (req, res) => {
    const userId = req.user.id;
    const messageTitle = req.body.title;
    const messageText = req.body.text;
    await db.addMessage(userId, messageTitle, messageText);
    res.redirect("/");
};

const deleteMessageGet = async (req, res) => {
    const messageId = decodeURIComponent(req.params.id);
    await db.deleteMessage(messageId);
    res.redirect("/");
};

const becomeMemberGet = async (req, res) => {
    console.log(req.session);
    res.render("become-member");
};

const becomeMemberPost = async (req, res) => {
    const userAnswer = req.body.question;
    const answer = 4;
    const userId = req.session.passport.user;
    console.log(userId);
    if (userAnswer == answer) {
        await db.becomeMember(userId);
        return res.redirect("/");
    }
    res.render("become-member", { userAnswer });
};

module.exports = {
    indexGet,
    registerGet,
    registerPost,
    loginGet,
    loginPost,
    logoutGet,
    addMessageGet,
    addMessagePost,
    deleteMessageGet,
    becomeMemberGet,
    becomeMemberPost,
};
