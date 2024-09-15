const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const indexGet = async (req, res) => {
    const messages = await db.getAllMessages();
    console.log(messages);
    res.render("index", { messages });
};

const registerGet = async (req, res) => {
    res.render("register");
};

const registerPost = async (req, res, next) => {
    try {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            await db.insertUser(req.body.username, hashedPassword);
            res.redirect("/");
        });
    } catch (err) {
        return next(err);
    }
};

const loginGet = async (req, res) => {
    res.render("login");
};

const loginPost = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
});

const logoutGet = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};

const deleteMessageGet = async (req, res) => {
    const messageId = decodeURIComponent(req.params.id);
    await db.deleteMessage(messageId);
    res.redirect("/");
};

module.exports = {
    indexGet,
    registerGet,
    registerPost,
    loginGet,
    loginPost,
    logoutGet,
    deleteMessageGet,
};
