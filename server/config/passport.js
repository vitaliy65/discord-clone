import mongoose from "mongoose";
import { ExtractJwt } from "passport-jwt";
import { Strategy as JwtStrategy } from "passport-jwt";
import User from "../models/User.js";
import { config } from "dotenv";

config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.secretOrKey,
};

export const passportConfig = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};
