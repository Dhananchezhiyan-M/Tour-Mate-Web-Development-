const mongoose = require('mongoose');
const Schema = mongoose.Schema;//creates the shortcut.
const passportLocalMongoose = require('passport-local-mongoose');

// Adds username and password fields to your schema.
// Hashes passwords using bcrypt.
// Adds helper methods like register(), authenticate(), serializeUser() etc., so you don't need to implement login logic manually.

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);//applies the passport-...to our schema

module.exports = mongoose.model('User', UserSchema);