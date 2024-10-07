const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const router = express.Router();
const bcrypt = require('bcrypt');
const Student = require('../models/student.js');
const User=require('../models/user.js');
// Configure Multer storage
const storage = multer.memoryStorage(); // Stores the file in memory
const upload = multer({ storage: storage });

// Endpoint to handle file upload
router.post('/upload-excel', upload.single('excelFile'),async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        // Read the Excel file from the uploaded buffer
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const students = XLSX.utils.sheet_to_json(sheet);
        console.log(students);
        const promises = students.map( async (studentData) => {
            // Insert into Student table
            const subjectsString = studentData.subjects;
            const subjectsArray = subjectsString.split(', ').map(subjectName => ({
              subjectName: subjectName,
              attendanceRecords: {
                presentDays: 0,
                totalDays: 0
              }
            }));
            const student = new Student({
                firstname: studentData.firstName,
                lastname: studentData.lastName,
                email: studentData.email,
                rollNumber: studentData.rollNumber,
                year: studentData.year,
                section: studentData.section,
                branch: studentData.branch,
                subjects: subjectsArray, // Assuming subjects is an array
            });

            // Save student data
            await student.save();

            // Insert into User table
            const username = studentData.rollNumber; // Example: using email as username
            const password = "Mansi"; // Example: using roll number as password

            // Hash the password before storing
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                username: username,
                password: hashedPassword
            });

            // Save user data
            await user.save();
        });

        // Wait for all insertions to complete
        await Promise.all(promises);

        res.send('Students and user accounts added successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing file.');
    }
});

module.exports = router;