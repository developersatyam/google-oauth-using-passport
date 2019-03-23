const express = require('express');
const app = express();
const passport = require('passport');
const PassportSetup = require('./config/passportSetup');
const mongoose=require('mongoose');
var cookieSession = require('cookie-session');

const db="mongodb://satyam:saty123@ds151450.mlab.com:51450/oauthtest"
mongoose.connect(db, ()=>{
console.log("database connected")
});

app.set("view engine", "ejs");

app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys: ['satyam']
  }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.render("index");
})
app.get("/oauth/google", passport.authenticate('google', {
    scope: ['profile']
}));
app.get("/oauth/google/callback", passport.authenticate('google'),
 (err, req, res, next) => {
        if (err.name === 'TokenError') {
            res.redirect('/auth/google');
        }
    },
    (req, res) => {
        res.send(req.user);
    });
app.listen(3000, () => {
    console.log("app on port 3000");
});