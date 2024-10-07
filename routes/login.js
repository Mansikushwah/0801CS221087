const bodyParser = require("body-parser");
const bcrypt=require('bcrypt');
const passport = require('passport');
const express = require('express');
const User = require('../models/user.js');
const Admin = require('../models/admin.js');
const router = express.Router();
const saltRounds = 10;
router.get("/", function(req, res) {
    res.render("home");
});
router.get("/Student_login", function(req, res) {
    res.render("Student_login");
});
router.get("/Faculty_login", function(req, res) {
    res.render("Faculty_login");
});
router.get("/Admin_login", function(req, res) {
    res.render("Admin_login");
});
router.get("/register", function(req, res) {
    res.render("register");
});
router.post("/register", async function(req, res) {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Create a new user with the hashed password
        const newAdmin = new Admin({
            username: req.body.username,
            password: hashedPassword
        });

        // Save the user to the database
        await newAdmin.save();
        res.redirect("/Admin_dashboard");

    } catch (err) {
        console.error("Failed to register user", err);
        res.redirect("/register");
    }
});

router.post("/Admin_login", passport.authenticate('admin-local', {
    successRedirect: "/Admin_dashboard",
    failureRedirect: "/Admin_login",
    failureFlash: true
}));
router.post("/Student_login", passport.authenticate('student-local', {
    successRedirect: "/Student_dashboard",
    failureRedirect: "/Student_login",
    failureFlash: true
}));
router.post("/Faculty_login", passport.authenticate('faculty-local', {
    successRedirect: "/Faculty_dashboard",
    failureRedirect: "/Faculty_login",
    failureFlash: true
}));
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
            return res.redirect('/');
        }
        res.redirect('/');
    });
});

module.exports = router;