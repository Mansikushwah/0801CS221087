const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb+srv://mansikushwah12345:ycgEEOU85wuBBEMA@cluster0.a8zfiwa.mongodb.net/department");
const studentSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    rollNumber: String,
    email: String,
    year: String,
    branch: String,
    section: String,
    subjects: [{
        subjectName: String,
        attendanceRecords: [{
            presentDays: { type: Number, default: 0 },
            totalDays: { type: Number, default: 0 }
        }]
    }] 
});

module.exports = mongoose.model('Student', studentSchema);