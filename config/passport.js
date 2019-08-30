const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("./keys");

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use("jwt", new JwtStrategy(options, function(jwt_payload, done) {
        User.findById(jwt_payload.id, function(err, user) {
            if (err) return done(err, false);
            if (user) return done(null, user);
            return done(null, false, {message: "User not found"});
        });
    }));
};


