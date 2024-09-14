require("dotenv").config();
const express = require("express");
const session = require("express-session");
// const passport = require("./config/passportConfig");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const bcrypt = require("bcryptjs");
const db = require("./db/queries");
const pool = require("./db/pool");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
app.use(
    session({
        secret: "cats",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    })
);
app.use("/", indexRouter);

app.listen(PORT, () => console.log(`App is live at port ${PORT}`));

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const { rows } = await pool.query(
                "SELECT * FROM users WHERE username = $1",
                [username]
            );
            const user = rows[0];

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
            id,
        ]);
        const user = rows[0];

        done(null, user);
    } catch (err) {
        done(err);
    }
});
