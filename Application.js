const mysql = require('mysql');
const inquirer = require('inquirer');
const e = require('express');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'cms_companyDB',
});


const RunAPP = () => {
    inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'Employees',
        'Roles',
        'Department',
        'Exit'
      ]    
    })
    .then((answer)=>{
      switch(answer.action){
        case 'Employees':
          console.log('hello');
          employeequest();
        break;
        case 'Roles':
          console.log('2')
          rolequest();
          break;
        case 'Department':
          console.log('kldsjaf');
          deptquest();
          break;
        case 'Exit':
          connection.end();
        default:
          console.log('Invalid Action');
      }
    })

}


connection.connect((err) => {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  RunAPP();
});



const deptquest = () => {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'Add',
      'Remove',
      'Edit',
      'View'
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
      case 'Edit':
        
        break;

      case 'View':
        console.log ('View')
      default:
        console.log('Invalid Action')
    }
  })

}


const rolequest = () => {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'Add',
      'Remove',
      'Edit',
      'View'
    ]    
  })
  .then((answer)=>{
    switch(answer.action){
      case 'Add':
        console.log('hello')
        getdepartments(2);
      break;
      case 'Remove':
        console.log('2')
        break;
      case 'Edit':
        console.log('kldsjaf')
        break;

      case 'View':
        console.log ('View')
      default:
        console.log('Invalid Action')
    }
  })

}

const employeequest = () => {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'Add',
      'Remove',
      'Edit',
      'View'
    ]    
  })
  .then((answer)=>{
    switch(answer.action){
      case 'Add':
        console.log('hello')
        getroles(1)
      break;
      case 'Remove':
        getEmloyees(1)
        console.log('2')
        break;
      case 'Edit':
        console.log('kldsjaf')
        getEmloyees(2)
        break;

      case 'View':
        console.log ('View')
      default:
        console.log('Invalid Action')
    }
  })

}

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
    
      default:
        break;
    }
  });
};

const getroles  = (call,names) =>{
  connection.query('SELECT * FROM roles', (err, res) => {
    if (err) throw err;
    let role = res
    let newrole=[]  
    switch (call) {
      case 1:
        role.forEach(({id,title})=> {
          newrole.push(id+'.'+title)
          });
      addEmployee(newrole);
        break;
      case 2:
        role.forEach(({id,name})=> {
          newrole.push(id+'.'+name)
          });
        updateEmployee(names,newrole);
    
      default:
        break;
    }
  });
};

const getEmloyees  = (call) =>{
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    let employee = res
    console.log(employee)
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
    
      default:
        break;
    }
  });
};

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

const removeDepartment = (depos) =>{
 
console.log(depos)
  inquirer.prompt({
    name: 'Department',
    type: 'list',
    message: 'Department Name:',
    choices: [...depos]
  })
  .then((answer) => {
    console.log(answer)
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
          RunAPP();
        }
      );
    });
    
  };

  const updateEmployee = (names,roles)=>{
    inquirer.prompt({
      name: 'employee',
      type: 'list',
      message: 'Please select employee.',
      choices: [...names]

    })
  }



  const addRole = (depart) =>{
    console.log(depart)
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
            // re-prompt the user for if they want to bid or post
            RunAPP();
          }
        );
      });
      
    };



  // 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name	FROM employee INNER JOIN role ON (employee.role_id = role.id AND employee.manager_id) INNER JOIN department on (department_id = department.id);'
