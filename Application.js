const mysql = require('mysql');
const inquirer = require('inquirer');
// Connetion
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'cms_companyDB',
});



// Starting app
const RunAPP = () => {
    inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'Employees',
        'Roles',
        'Department',
        'View All',
        'Exit'
      ]    
    })
    .then((answer)=>{
      switch(answer.action){
        case 'Employees':
          
          employeequest();
        break;
        case 'Roles':
          
          rolequest();
          break;
        case 'Department':
          deptquest();
          break;
        case 'View All':
          viewall()
        case 'Exit':
          connection.end();
        default:
          console.log('Invalid Action');
          RunAPP();
      }
    })

}




// Department Options
const deptquest = () => {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'Department Menu?',
    choices: [
      'Add',
      'Remove',
      'Edit',
      'View',
      'Back'
    ]    
  })
  .then((answer)=>{
    switch(answer.action){
      case 'Add':
        addDepartment();
      break;
      case 'Remove':
        getdepartments(1);
        break;
      case 'View':
      getdepartments(3)
      case 'Back':
        RunAPP();
      default:
        console.log('Invalid Action')
        deptquest();
    }
  })

}

// Role Menu
const rolequest = () => {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'Role Menu?',
    choices: [
      'Add',
      'Remove',
      'Edit',
      'View',
      'Back'
    ]    
  })
  .then((answer)=>{
    switch(answer.action){
      case 'Add':
        
        getdepartments(2);
      break;
      case 'Remove':
        
        break;
      case 'Edit':
        
        break;

      case 'View':
        
        getroles(3)
      case 'Back':
          RunAPP();
      default:
        console.log('Invalid Action')
        rolequest();
    }
  })

}

// Employee Menu
const employeequest = () => {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'Employee Menu',
    choices: [
      'Add',
      'Remove',
      'Edit',
      'View',
      'Back'
    ]    
  })
  .then((answer)=>{
    switch(answer.action){
      case 'Add':
        getroles(1)
      break;
      case 'Remove':
        getEmloyees(1);
        break;
      case 'Edit':
        getEmloyees(2);
        break;
      case 'View':
        getEmloyees(3);
      case 'Back':
          RunAPP();
      default:
        console.log('Invalid Action')
        employeequest();
    }
  })

}

// Get all Department info for other functions
const getdepartments  = (call) =>{
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    let depo = res
    let newdepo=[]  
    switch (call) {
      case 1:
        depo.forEach(({id,name})=> {
          newdepo.push(id+'.'+name)
          });
      removeDepartment(newdepo);
        break;
      case 2:
        depo.forEach(({id,name})=> {
          newdepo.push(id+'.'+name)
          });
        addRole(newdepo);
        case 3: 
        console.table(depo);
        deptquest();
    
      default:
        break;
    }
  });
};


// get all Rolls for other fuctions
const getroles  = (call,names) =>{
  connection.query('SELECT * FROM roles', (err, res) => {
    if (err) throw err;
    let role = res
    let newrole=[] 
    role.forEach(({id,title})=> {
      newrole.push(id+'.'+title)
      }); 
    switch (call) {
      case 1:
      addEmployee(newrole);
        break;
      case 2:
        updateEmployee(names,newrole);
      case 3:
        console.table(newrole)
        rolequest();
    
      default:
        break;
    }
  });
};

// get all employees for other functions
const getEmloyees  = (call) =>{
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    let employee = res
  
    let newemployee=[]  
    switch (call) {
      case 1:
      //   employee.forEach(({id,first_name,last_name})=> {
      //     newemployee.push(id+'.'+first_name+last_name)
      //     });
      // addEmployee(newemployee);
        break;
        case 2:
        employee.forEach(({id,first_name,last_name})=> {
          newemployee.push(id+'.'+first_name+' '+last_name)
          });
      getroles(2,newemployee);
      case 3:
        console.table(employee)
        employeequest();
    
      default:
        break;
    }
  });
};

// Add a department
const addDepartment = () =>{
inquirer.prompt({
  name: 'depo',
  type: 'input',
  message: 'Input Department Name:',
})

  .then((answer) => {
    
    connection.query(
      'INSERT INTO department SET ?',
      {
        name: answer.depo
      },
      (err) => {
        if (err) throw err;
        console.log('Your department was created successfully!');
        // re-prompt the user for if they want to bid or post
        RunAPP();
      }
    );
  });
  
};
// Remove department
const removeDepartment = (depos) =>{
 

  inquirer.prompt({
    name: 'Department',
    type: 'list',
    message: 'Department Name:',
    choices: [...depos]
  })
  .then((answer) => {
    let dep_id = answer.Department.split('.')
    
    connection.query(
      'DELETE FROM department WHERE ?',
      {
        id: dep_id[0]
      },
      (err) => {
        if (err) throw err;
        console.log('Your department was deleted successfully!');
        // re-prompt the user for if they want to bid or post
        RunAPP();
      }
    );
  });
  
};






const addEmployee = (roles) =>{
  inquirer.prompt([{
    name: 'first',
    type: 'input',
    message: 'First Name:',
  },
  {
    name: 'last',
    type: 'input',
    message: 'Last Name:',
  },
  {
    name: 'role',
    type: 'list',
    message: 'Role:',
    choices: [...roles]
  },
  {
    name: 'manager',
    type: 'input',
    message: 'Manager ID',
  }]

  )
  
    .then((answer) => {
      let newrole = answer.role.split('.')
      
      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: answer.first,
          last_name: answer.last,
          role_id: newrole[0],
          manager_id: answer.manager
        },
        (err) => {
          if (err) throw err;
          console.log('Your employee was created successfully!');
          employeequest();
        }
      );
    });
    
  };

  const updateEmployee = (names,roles)=>{
    inquirer.prompt([{
      name: 'employee',
      type: 'list',
      message: 'Please select employee.',
      choices: [...names]

    },
  {
    name: 'role',
    type: 'list',
    message: 'Please select employee.',
    choices: [...roles] 
  }])
    .then((answer)=>{
      let emp_id = answer.employee.split('.');
      let role_id = answer.employee.split('.');

      let updatsql = `UPDATE employee SET ? Where id= ?`

      connection.query(updatsql,[role_id[0],emp_id[0]])


    })
  }



  const addRole = (depart) =>{
   
    inquirer.prompt([{
      name: 'role',
      type: 'input',
      message: 'Input Role Name:',
    },
    {
      name: 'department',
      type: 'list',
      message:'Please pick Department',
      choices: [...depart]
    },
  {
    name: 'salary',
    input: 'input',
    message: 'Please enter roles salary'
  }])
    
      .then((answer) => {
        let dep_id = answer.department.split('.')
        

        
        connection.query(
          'INSERT INTO roles SET ?',
          {
            title:answer.role,
            salary: answer.salary,
            department_id: dep_id[0]
          },
          (err) => {
            if (err) throw err;
            console.log('Your role was created successfully!');
            rolequest();
          }
        );
      });
      
    };


    // Start Connection and run App
    connection.connect((err) => {
      if (err) throw err;
      RunAPP();
    });
    


  // 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name	FROM employee INNER JOIN role ON (employee.role_id = role.id AND employee.manager_id) INNER JOIN department on (department_id = department.id);'
