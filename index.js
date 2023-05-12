//Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');


//Connect to mysql database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'serenity123',
    database: 'employee_db'
    }, 
    console.log('connected to database')
    
);


//inquirer prompts for user to view the database data by responding to choices
const init = () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Please choose from the following options:",
                name: 'userPrompt',
                choices: [
                    "View all Departments",
                    "View all Roles",
                    "View all Employees",
                    "Add a department",
                    "Add a role",
                    "Add an employee"
                ]
            }
        ]).then(ans => {
            switch (ans.userPrompt) {
                case "View all Departments": viewDept();
                    break;
                case "View all Roles": viewRoles();
                    break;
                case "View all Employees": viewEmployees();
                    break;
                case "Add a department" : addDept();
                    break;
                case "Add a role" : addRole();
            }

        })
        
        
        
    };      
    

const viewDept = () => {
    db.query(`SELECT * from department`, (err,result) => {
        err ? console.error(err) : console.table(result);
        init();
    })

};


const viewRoles = () => {
    db.query(`SELECT * from role`, (err,result) => {
        err ? console.error(err) : console.table(result);
        init();
    })
};

const viewEmployees = () => {
    db.query(`SELECT * from employee`, (err,result) => {
        err ? console.error(err) : console.table(result);
        init();
    })
};

const addDept = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is name of the department you would like to add?',
                name: 'addDept'
            }
        ]).then(ans => {
            db.query(`INSERT INTO department (name)
            VALUES(?) `, ans.addDept, (err,result) => {
                err ? console.error(err) : console.table(result);
                console.log('Department added');
                init();
            } )

        })
}

const addRole  = () => {

   db.query(`SELECT * from department`, (err,result) => {
        const deptArr = result.map(pikachu => {
            return pikachu.name;
            
        })
        // console.log(deptArr);
        inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter the name of the role',
                name: 'roleName'
            },
            {
                type: 'input',
                message: 'Enter the salary for this role',
                name: 'roleSalary'
            },
            {
                type: 'list',
                message: 'Enter the department for the role',
                name: 'roleDept',
                choices: deptArr
            }
        ]).then(ans => {
            var deptId;
            for(var i = 0;  i < deptArr.length; i++) {
                if(result[i].name === ans.roleDept) {
                    deptId = result[i].deptId;
                }

            }

            db.query(`INSERT INTO role(title, salary, department_id) VALUES (?,?,?)`, [ans.roleName, ans.roleSalary, deptId], (err,result) => {
                console.log("\n")
                err ? console.error(err) : console.log("Role added.");
                console.log("\n")
                init();
            } )

            
          
            
        })



    });
    


 





  
};


init();