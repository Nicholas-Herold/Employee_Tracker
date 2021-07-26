USE cms_companydb;

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES('Baskin','Robins','1','1'),
        ('Chris','Calhoun','2','0');
        
INSERT INTO roles (title,salary,department_id)
VALUES ('Manager','70000.00','1'),
        ('Service_Tech','45000.00','1');

INSERT INTO department(name)
    VALUES('Service'),
            ('Sales'),
            ('Parts'),
            ('NTS');