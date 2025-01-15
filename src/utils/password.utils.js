import brcrypt from 'bcrypt';

export async function hashPassword(password) {
    return await brcrypt.hash(password, brcrypt.genSaltSync(10));
}

export async function comparePassword(password, hashedPassword) {
    return await brcrypt.compare(password, hashedPassword);
}