const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb+srv://mansikushwah12345:ycgEEOU85wuBBEMA@cluster0.a8zfiwa.mongodb.net/department");
const FacultySchema = new mongoose.Schema({
    username: String,
    password: String
});
FacultySchema.plugin(passportLocalMongoose);


const Faculty = mongoose.model('Faculty', FacultySchema);
// console.log("Passport-Local-Mongoose Plugin Applied:", typeof User.createStrategy);
module.exports = Faculty;