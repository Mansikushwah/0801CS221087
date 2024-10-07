const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const express = require('express');
const Student = require('../models/student.js');
const Facultyinfo = require('../models/facultyinfo.js');
const Faculty =require('../models/faculty.js');
const User=require('../models/user.js');
const router = express.Router();
router.get("/Admin_dashboard", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("Admin_dashboard");
    } else {
        res.redirect("/Admin_login");
    }
});
router.get("/Student_dashboard", async(req, res)=>{
    if (req.isAuthenticated()) { 
        const loggedInUser = req.user; 
        console.log(loggedInUser);
        const student = await Student.findOne({ rollNumber: loggedInUser.username });
        console.log(student);
        res.render("Student_dashboard", { student: student });
    } else {
        res.redirect("/Student_login");
    }
});
router.get("/Student_attendance", async(req, res)=>{
    if (req.isAuthenticated()) { 
        const subjectName = req.query.subjectName;
        const loggedInUser = req.user; 
        const student = await Student.findOne({ rollNumber: loggedInUser.username });
        const subject = student.subjects.find(sub => sub.subjectName === subjectName);
        if (subject) {
            res.render('Student_attendance', { student: student, subject: subject });
        } else {
            res.status(404).send("Subject not found for the student.");
        }
    } else {
        res.redirect("/login");
    }
});
router.get("/Add_student", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("Add_student");
    } else {
        res.redirect("/Admin_login");
    }
});
router.get("/Add_students", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("Add_students");
    } else {
        res.redirect("/Admin_login");
    }
});
router.get("/Add_faculty", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("Add_faculty");
    } else {
        res.redirect("/Admin_login");
    }
});
router.post("/Add_student", async function(req, res) {
    try {
        const newstudent = new Student({
            firstname: req.body.firstName,
            lastname: req.body.lastName,
            rollNumber: req.body.rollNumber,
            email: req.body.email,
            year: req.body.year,
            branch: req.body.branch,
            section: req.body.section,
            subjects: req.body.subjects.map(subject => ({
                subjectName: subject,
                attendanceRecords: {
                    presentDays: 0,
                    totalDays: 0
                }
            }))
        });
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash("Mansi", saltRounds);
        const user = new User({
            username: req.body.rollNumber,
            password: hashedPassword
        });
        await user.save();
        await newstudent.save();

        res.redirect('/Admin_dashboard');
    } catch (err) {
        console.log('Error adding student:', err);
        res.redirect('/Add_student');
    }
});

router.post("/Add_faculty", async function(req, res) {
    try {
        const newfaculty = new Facultyinfo({
            firstname: req.body.firstName,
            lastname: req.body.lastName,
            facultyid: req.body.facultyid,
            email: req.body.email,
            department: req.body.department,
        });
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash("Sgsits", saltRounds);
        const faculty = new Faculty({
            username: req.body.facultyid,
            password: hashedPassword
        });
        await faculty.save();
        await newfaculty.save();

        res.redirect('/Admin_dashboard');
    } catch (err) {
        console.log('Error adding student:', err);
        res.redirect('/Add_faculty');
    }
});
router.get("/Faculty_dashboard", async(req, res)=> {
    if (req.isAuthenticated()) {
        const loggedInUser = req.user; 
        console.log(loggedInUser);
        const faculty = await Facultyinfo.findOne({ facultyid: loggedInUser.username });
        res.render("Faculty_dashboard",{faculty: faculty});
    } else {
        res.redirect("/Faculty_login");
    }
});

router.get("/studentattendance", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("studentattendance");
    } else {
        res.redirect("/login");
    }
});
router.post("/Students_list",async(req,res)=>{
    try {
        const { attendanceDate, subject, attendanceStatus, rollNumbers } = req.body;
        for (let i = 0; i < attendanceStatus.length; i++) {
            const rollNumber = rollNumbers[i];
            const status = attendanceStatus[i];
            const student = await Student.findOne({ rollNumber: rollNumber });
            console.log(student);
            if (student) {
                const subjectRecord = student.subjects.find(sub => sub.subjectName === subject);
                console.log(subject);
                console.log(subjectRecord);
                console.log(status);
                console.log(typeof(status));
                if (subjectRecord && subjectRecord.attendanceRecords) {
                    if (status === 'green') {
                        subjectRecord.attendanceRecords[0].presentDays += 1;
                        subjectRecord.attendanceRecords[0].totalDays += 1;
                    }
                    else if(status === 'grey') {
                        subjectRecord.attendanceRecords[0].totalDays += 1;
                    }
                    await student.save();
                }
            } else {
                console.error(`Student with roll number ${rollNumber} and subject ${subject} not found.`);
            }
        }

        res.send("Attendance updated successfully.");
    } catch (error) {
        console.error("Error updating attendance:", error);
        res.status(500).send("An error occurred while updating attendance.");
    }
})
router.get("/Mark_attendance", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("Mark_attendance");
    } else {
        res.redirect("/Faculty_login");
    }
});
router.post("/Mark_attendance",async(req,res)=>{
        const { year, branch, section } = req.body;
        console.log("hello");
        try {
            const { year, branch, section, subject } = req.body;
            const students = await Student.find({ year, branch, section });
            console.log(students);
            const subjectRecords = students.map(student => {
                const subjectRecord = student.subjects.find(sub => sub.subjectName === subject);
                return { student, subjectRecord };
            });
                console.log(subjectRecords);
            if (req.isAuthenticated()) {
                res.render('Students_list', { subjectRecords });
            } else {
                res.redirect("/Faculty_login");
            }
            
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
});
module.exports = router;