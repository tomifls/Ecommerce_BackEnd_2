import jwt from "jsonwebtoken";

export const SECRET = "s3cr3t";

export function createToken(payload) {
    return jwt.sign(payload, "s3cr3t", {
        expiresIn: "10m" 
    })
};

export function verifyToken(token) {
    return jwt.verify(token, "s3cr3t");
}