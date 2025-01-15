import passport from "passport";
import { Strategy as JWTStrategy, ExtractJWT } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { createToken, SECRET } from "../utils/jwt.utils.js";
import { userModel } from "../dao/models/user.model.js";

import { comparePassword } from "../utils/password.utils.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "s3cr3t";
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;

export function initializePassport() {
// JWT Strategies
    passport.use(
        "jwt",
        new JWTStrategy(
            {
                secretOrKey: JWT_SECRET,
                jwtFromRequest: ExtractJWT.fromExtractors([
                    cookieExtractor
                ]),
            },  async (payload, done) => {
                try {
                    const user = await userModel.findById(payload.id)

                    if (!user) {
                        return done(null, false)
                    }

                    return done (null, payload)
                } catch (error) {
                    return done(error, false)
                }
                
            }
        )
    );

// Local Strategies 
passport.use(
    "register",
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: "email",
        },
        async (req, email, password, done) => {
            const { first_name, last_name, age, role } = req.body;

            if (!first_name || !last_name || !age ) {
                return done(null, false, { message: "Missing Fields" });
            }
                try {
                    const userExists = await userModel.findOne({ email });

                if (userExists) {
                    return done(null, false, { message: "User already exists" });
                }

            const user = await userModel.create({
                first_name,
                last_name,
                email,
                age,
                password,
                role,
            });

            return done(null, user);
        } catch (error) {
            return done(`Hubo un error: ${error}`);
        }
        }
    )
);

passport.use(
    "login",
        new LocalStrategy(
        {
            usernameField: "email",
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
            const user = await userModel.findOne({ email });

            if (!user)
                return done(null, false, { message: "User does not exist" });

            const isPasswordValid = await comparePassword( 
                password, 
                user.password 
            );

            if (!isPasswordValid) 
                return done (null, false, { message: "Invalid Password" })
                
                const token = createToken({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                });
                
                req.token = token;

            return done(null, user);
        } catch (error) {
            return done(`Hubo un error: ${error}`);
        }
        }
    )
);

// serialize & deserialize
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);

    if (!user) return done(null, false);

    done(null, user);
});
}

function cookieExtractor(req) {
    return req && req.cookies ? req.cookies.token : null
};