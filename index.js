//Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

//Connect to a database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'serenity123',
    database: 'employee_tracker_db'
    }, 
    console.log('connected to database')
);


//inquirer prompts for user to view the database data by responding to choices
const init = () => {
    inquirer
        .createPromptModule([
            {
                type: "list",
                message: "Please choose from the following options:",
                choices: [
                    "View all Departments",
                    "View all roles",
                    "View all employees",
                    "Add a department",
                    "Add a role",
                    "Add an employee"
                ]
            }
        ]).then((answers) => {
            if(answers.prompt === 'View all Departments') {
                db.query(`SELECT * FROM department`, (err,result) => {
                    if (err) throw err;
                    console.log("Viewing all departments: ");
                    console.table(result);
                })
            }
        })
}

init();
