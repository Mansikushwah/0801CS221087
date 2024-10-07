const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb+srv://mansikushwah12345:ycgEEOU85wuBBEMA@cluster0.a8zfiwa.mongodb.net/department");
const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});
adminSchema.plugin(passportLocalMongoose);


const Admin = mongoose.model('Admin', adminSchema);
// console.log("Passport-Local-Mongoose Plugin Applied:", typeof User.createStrategy);
module.exports = Admin;