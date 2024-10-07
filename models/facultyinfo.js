const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb+srv://mansikushwah12345:ycgEEOU85wuBBEMA@cluster0.a8zfiwa.mongodb.net/department");
const FacultyinfoSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    facultyid: String,
    email: String,
    department: String,
});

module.exports = mongoose.model('Facultyinfo', FacultyinfoSchema);