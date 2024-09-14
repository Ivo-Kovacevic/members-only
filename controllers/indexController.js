const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const indexGet = async (req, res) => {
    res.render("index");
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

// const loginPost = (req, res) => {
//     passport.authenticate("local", {
//         successRedirect: "/",
//         failureRedirect: "/login",
//     })
// };

module.exports = {
    indexGet,
    registerGet,
    registerPost,
    loginGet,
    // loginPost,
};
