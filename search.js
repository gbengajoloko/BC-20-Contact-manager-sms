var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('Database/newdb');
var inquirer = require('inquirer');
var chalk = require('chalk');
function search (value) {
  var newarr = [];
  db.serialize(function () {
    var smt = db.prepare('SELECT name , phoneNumber FROM contacts WHERE name LIKE ?');
    smt.each(`%${value}%`, function (err, row) {
      if (err) { 
        console.log('Name does not exist in contact list');
      }
      if (row) {
        newarr.push(row);
      }
    })
    setTimeout(() => {
      if (newarr.length === 0) {
        console.log('Name does not exists in contact list') 
      } else if (newarr.length == 1) {
        console.log(`the phonenumber is: ${newarr[0]['phoneNumber']}`);
      } else {
        console.log(chalk.bold.red(`you have more than one person named ${value} in your contact list`))
        for (var i = 0; i < newarr.length; i++) {
          console.log(chalk.blue.bold(`${i + 1}: ${newarr[i]['name']}`));
        }
        inquirer.prompt([
          {
            type: 'input',
            name: 'number',
            message: chalk.blue.bold('select the number with the name you are searching for'),
            validate: function (value) {
              if (value > 0 && value <= newarr.length) {
                return true;
              } else {
                return 'please enter valid value';
              }
            }

          }]).then(function (answers) {
            console.log(chalk.yellow.red(`the phone number for ${newarr[answers['number'] - 1]['name']} is ${newarr[answers['number'] - 1]['phoneNumber']}`));
          })
      }
    }, 20)
  })
}
var arr = process.argv.slice(2);
if (arr.length > 2) {
  console.log('too many search parameters entereed');
  process.exit();
} else if (!arr.length) {
  console.log('no delete parameter entered');
  process.exit();
} else if (arr[0] && arr[1]) {
  var val = arr.join(' ');
  search(val);
} else if (arr[0] !== undefined) {
  search(arr[0]);
}