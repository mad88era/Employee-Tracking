// Import and require packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const fs = require('fs');

// Connect to my sql database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'MiamiDolphins1972!',
        database: 'employee_manager_db'
    },
    console.log(`Connected to the employee_manager_db database.`)
);

// Function that lists main menu options using a promise
function employeeManager() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee',
            'Exit'
        ]
    }).then(answer => {
        // Performs different actions based on user input
        switch (answer.action) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee':
                updateEmployeeRole();
                break; // Add break statement here
            case 'Exit':
                console.log('Have a good day. Goodbye.');
                process.exit(0);
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}

// Function to view list of all departments in a table
function viewAllDepartments() {
    db.query('SELECT * FROM department', (error, results) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        console.table(results);
        employeeManager();
    });
}

// Function to view list of all the roles in a table
function viewAllRoles() {
    db.query('SELECT * FROM role', (error, results) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        console.table(results);
        employeeManager();
    });
}
// Function to view list of all employees including their title, salary, and manager
function viewAllEmployees() {
    fs.readFile('db/query.sql', 'utf8', (error, data) => {
        if (error) {
            console.error('Error reading query.sql:', error);
            return;
        }
        db.query(data, (error, results) => {
            if (error) {
                console.error('Error executing SQL query:', error);
                return;
            }
            if (results.length === 0) {
                console.log('No employees found.');
            } else {
                console.table(results);
            }
            employeeManager();
        });
    });
}
// Runs the function & initialize the employee manager/database
employeeManager();

// Function to add a department using inquirer to prompt user to enter details
function addDepartment() {
    inquirer.prompt({
        name: 'departmentName',
        type: 'input',
        message: 'Enter the name of the department:'
    }).then(answers => {
        db.query('INSERT INTO department (department_name) VALUES (?)', [answers.departmentName], (error, result) => {
            if (error) {
                console.error('Error adding department:', error);
                return;
            }
            console.log('Department added successfully!');
            employeeManager();
        });
    });
};

// Function to add a role using inquirer to prompt user to enter role details
function addRole() {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Enter the title of the role:'
        },
        {
            name: 'salary',
            type: 'number',
            message: 'Enter the salary for the role:'
        },
        {
            name: 'department',
            type: 'input',
            message: 'Enter the department for the role:'
        }
    ]).then(answers => {
        // Get the department ID based on the department name entered by the user
        db.query('SELECT id FROM department WHERE department_name = ?', [answers.department], (error, results) => {
            if (error) {
                console.error('There was an error getting department ID:', error);
                return;
            }
            // If department not found, display an error message
            if (results.length === 0) {
                console.error('Department not found.');
                return;
            }
            // Get department ID from the results and insert the new role into the database
            const departmentId = results[0].id;
            db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, departmentId], (error, result) => {
                if (error) {
                    console.error('Error adding role:', error);
                    return;
                }
                console.log('Role added successfully!');
                employeeManager();
            });
        });
    });
}
// Function to add an employee using inquirer to prompt user to enter employee details
function addEmployee() {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'Enter the first name of the employee:'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'Enter the last name of the employee:'
        },
        {
            name: 'departmentName',
        type: 'input',
        message: 'Enter the department for employee:'
        },
        {
            name: 'salary',
            type: 'number',
            message: 'Enter the salary for the employee:'
        }
    ]).then(answers => {
        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.firstName, answers.lastName, answers.roleId, answers.managerId], (error, result) => {
            if (error) {
                console.error('Error adding employee:', error);
                return;
            }
            console.log('Employee added successfully!');
            employeeManager();
        });
    });
}
