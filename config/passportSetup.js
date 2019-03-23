const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user.id);
  })
});

passport.use(new GoogleStrategy({
    clientID: "106847569314-056lr0ugof591uv2hqdr3pemtbrpfhuq.apps.googleusercontent.com",
    clientSecret: "J89MjL4rnRUfJGcniv07L2gD",
    callbackURL: "/oauth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({
      googleId: profile.id
    }).then(user => {
      if (user) {
        console.log('user already in database');
        done(null, user);
      } else {
        new User({
          userName: profile.displayName,
          googleId: profile.id
        }).save().then((data) => {
          console.log(`${data.userName} saved to the database`);
          done(null, data);
        })
      }
    })



    // console.log(accessToken);
    // console.log(refreshToken);
    // console.log(profile);
  }
));