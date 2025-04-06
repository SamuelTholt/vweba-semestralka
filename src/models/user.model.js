import { Schema } from "mongoose";

import crypto from "crypto";

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        salt: { type: String, required: true },
    },
    { timestamps: true }
);

userSchema.methods.nastavitHeslo = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

userSchema.methods.checkHeslo =  function (password) {
    const hash_pwd = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
    return this.password === hash_pwd;
}

module.exports = mongoose.model("User", userSchema);