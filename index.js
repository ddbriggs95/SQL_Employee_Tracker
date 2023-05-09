//Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');

//Connect to a database
const db = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: 'serenity123',
    database: 'employee_tracker_db'
});


//prompts for user to view the database data
