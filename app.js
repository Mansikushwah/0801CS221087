const bodyParser = require("body-parser");
const session = require('express-session');
const bcrypt=require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const flash = require('connect-flash');
const User = require('./models/user.js');
const Admin = require('./models/admin.js');
const Faculty = require('./models/faculty.js');
const app = express();
app.use(express.static('public'));

const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(session({
    secret: "YourSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day in milliseconds
}));
app.use(flash());
app.use(function(req, res, next) {
    res.locals.success_flash = req.flash('success');
    res.locals.error_flash = req.flash('error');
    next();
});
app.use(passport.initialize());
app.use(passport.session());

passport.use('admin-local', new LocalStrategy(
    async function(username, password, done) {
        try {
            const admin = await Admin.findOne({ username });
            if (!admin) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            const isMatch = await bcrypt.compare(password,admin.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, admin);
        } catch (err) {
            return done(err);
        }
    }
));
passport.use('student-local', new LocalStrategy(
    async function(username, password, done) {
        try {
            const student = await User.findOne({ username });
            if (!student) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            const isMatch = await bcrypt.compare(password,student.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, student);
        } catch (err) {
            return done(err);
        }
    }
));
passport.use('faculty-local', new LocalStrategy(
    async function(username, password, done) {
        try {
            const faculty = await Faculty.findOne({ username });
            if (!faculty) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            const isMatch = await bcrypt.compare(password,faculty.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, faculty);
        } catch (err) {
            return done(err);
        }
    }
));
passport.serializeUser(function(user, done) {
    done(null, { id: user.id, type: user.constructor.modelName });
});
passport.deserializeUser(async function(obj, done) {
    try {
        let user;
        if (obj.type === 'Admin') {
            user = await Admin.findById(obj.id);
        } else if (obj.type === 'User') {
            user = await User.findById(obj.id);
        } else if (obj.type === 'Faculty') {
            user = await Faculty.findById(obj.id);
        }
        done(null, user);
    } catch (err) {
        done(err);
    }
});
app.use(require('./routes/login'));
app.use(require('./routes/index'));
app.use(require('./routes/studentRoutes.js'));
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
