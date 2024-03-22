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
                viewAllEmployeesFromSeeds(); // Updated function call
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
                break;
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
    db.query('SELECT id, department_name FROM department', (error, results) => {
        if (error) {
            console.error('Error fetching departments:', error);
            return;
        }
        console.table(results, ['id', 'department_name']);
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

// Function to view list of all employees from the seeds.sql file
function viewAllEmployeesFromSeeds() {
    db.query('SELECT * FROM employee', (error, results) => {
        if (error) {
            console.error('Error fetching employees:', error);
            return;
        }
        console.table(results);
        employeeManager();
    });
}


// Function to view list of all employees including their title, salary, and manager
function viewAllEmployees() {
    // Read the SQL query from the query.sql file & execute the query
    fs.readFile('db/query.sql', 'utf8', (error, data) => {
        if (error) {
            console.error('Error reading query.sql:', error);
            employeeManager();
            return;
        }
        db.query(data, (error, results) => {
            if (error) {
                console.error('Error executing query:', error);
                return;
            }
            console.table(results);
            employeeManager();
        });
    });
}
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
};

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
            name: 'roleId',
            type: 'number',
            message: 'Enter the role ID of the employee:'
        },
        {
            name: 'managerId',
            type: 'number',
            message: 'Enter the manager ID of the employee (optional, leave empty if none):',
            default: null, // Default value if user leaves it empty
            validate: function (input) {
                // Validate if the input is a number or empty
                if (input === '') return true; // Allow empty input
                if (!Number.isInteger(Number(input))) {
                    return 'Please enter a valid number or leave it empty.';
                }
                return true;
            }
        }
    ]).then(answers => {
        const { firstName, lastName, roleId, managerId } = answers;
        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId], (error, result) => {
            if (error) {
                console.error('Error adding employee:', error);
                return;
            }
            console.log('Employee added successfully!');
            employeeManager();
        });
    });
};


// Runs the function & initialize the employee manager/database
employeeManager();

// Add other functions (addDepartment, addRole, etc.) as needed...
