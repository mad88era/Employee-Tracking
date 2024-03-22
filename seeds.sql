INSERT INTO department (department_name)
VALUES  ('Engineering'),
        ('Finance'),
        ('Legal'),
        ('Sales'),
        ('Customer Service');

INSERT INTO role (title, salary, department_id)
VALUES  ('Software Engineer', 105000, 001),
        ('Accountant', 100000, 002),
        ('Lawyer', 125000, 003),
        ('Sales Consultant', 100000, 004),
        ('Customer Service Rep', 45000, 005),
        ('Call Center Rep', 50000, 005);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('John', 'Doe', 1, 01),
        ('Michael', 'Lynn', 2, 02),
        ('Emily', 'Nelson', 3, NULL),
        ('Ashlee', 'Davis', 4, 03),
        ('Sarah', 'Johnson', 5, 04),
        ('LLoyd', 'Swanson', 6, 04);