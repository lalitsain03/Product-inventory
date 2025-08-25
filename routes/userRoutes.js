const express = require("express");
const router = express.Router();
const User = require("../models/user");
const flash = require("connect-flash");
const passport = require("passport");


router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
})

router.post("/signup", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({
            username: username,
            email: email,
        });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Product Inventory");
            let redirectUrl = res.locals.redirectUrl || "/products";
            res.redirect(redirectUrl);
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})
router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
    req.flash("success", "Welcome Back to Product Inventory");
    let redirectUrl = res.locals.redirectUrl || "/products";
    res.redirect(redirectUrl);
})

router.get("/logout", async (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "youo are logged out");
        res.redirect("/products");
    })
})
module.exports = router;

