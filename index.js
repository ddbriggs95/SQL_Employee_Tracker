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


//inquirer prompts for user to view the database data or perform an action by responding to choices
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
                    "Add an employee",
                    "Update an employee",
                    "Log out"
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
                    break;
                case "Add an employee" : addEmployee();
                    break;
                case "Update an employee role": updateEmployee();
                    break;
                case "Log out": endApp();
                    break;

            }

        })      
    };      
    
//function to view departments from DB
const viewDept = () => {
    db.query(`SELECT * from department`, (err,result) => {
        err ? console.error(err) : console.table(result);
        init();
    })

};

//function to view roles from DB
const viewRoles = () => {
    db.query(`SELECT * from role`, (err,result) => {
        err ? console.error(err) : console.table(result);
        init();
    })
};

//function to view employees from DB
const viewEmployees = () => {
    db.query(`SELECT * from employee`, (err,result) => {
        err ? console.error(err) : console.table(result);
        init();
    })
};


//function to add Dept created by user - specifying name
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
                err ? console.error(err) : console.log('Department added');
                
                init();
            } )

        })
}


//function to add Role created by user - specifying name and salary
const addRole  = () => {

   db.query(`SELECT * from department`, (err,result) => {
        const deptArr = result.map(array => {
            return array.name;
            
        })
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
            //in this code I am grabbing the dept id  from the dept choice selected by user
            var deptId; 
            for(var i = 0;  i < deptArr.length; i++) {
                if(result[i].name === ans.roleDept) {
                    deptId = result[i].deptId;
                }

            }
            //inserting the new role into the DB using newly created name and salary and the dept id captured in above code
            db.query(`INSERT INTO role(title, salary, department_id) VALUES (?,?,?)`, [ans.roleName, ans.roleSalary, deptId], (err,result) => {
                console.log("\n")
                err ? console.error(err) : console.log("Role added.");
                console.log("\n")
                init();
            } )

            
          
            
        })
    });
  
};
//function to add an employee
const addEmployee = () => {

   db.query(`SELECT * from role`, (err,result) => {
    const roleArr = result.map(array => {
        return array.name;
    })
   })
            
    inquirer
    .prompt([
        {
            type: 'input',
            message: "What is the employee's first name?",
            name: 'firstName'
        },
        {
            type: 'input',
            message: "What is the employee's last name?",
            name: 'lastName'
        },
        
    ]).then(ans => {
        db.query(`INSERT INTO employee(first_name, last_name) VALUES (?,?)`, [ans.firstName, ans.lastName], (err, results) => {
            if (err) {
                console.log(err)
            } else {
                console.log('Employee successfully Added.')
                init();
            }
        })
       
    })

}

//Log out function
const endApp = () => {
    console.log("Thanks for visiting the Employee Tracker!");
    process.exit();
}


init();