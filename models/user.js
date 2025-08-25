const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
});
// add username + password fields automatically
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);