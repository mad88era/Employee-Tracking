SELECT
    employee.id AS Employee_ID,
    employee.first_name AS first_name,
    employee.last_name AS Last_Name, 
    role.title AS Job_Title, 
    department.department_name AS Department, 
    role.salary AS Salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
FROM 
     employee
INNER JOIN 
    role ON employee.role_id = role.id
INNER JOIN 
    department ON role.department_id = department.id
LEFT JOIN 
    employee manager ON employee.manager_id = manager.id;