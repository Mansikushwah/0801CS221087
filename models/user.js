const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb+srv://mansikushwah12345:ycgEEOU85wuBBEMA@cluster0.a8zfiwa.mongodb.net/department");
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
userSchema.plugin(passportLocalMongoose);


const User = mongoose.model('User', userSchema);
// console.log("Passport-Local-Mongoose Plugin Applied:", typeof User.createStrategy);
module.exports = User;