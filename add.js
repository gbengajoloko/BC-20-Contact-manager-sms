var arr = process.argv.slice(2);
var chalk = require('chalk');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('Database/newdb');
var colors = require('colors');
function addContacts (fullName, number) {
  db.serialize(function () {
    db.run('CREATE TABLE IF NOT EXISTS contacts (name TEXT UNIQUE, phoneNumber TEXT UNIQUE)');
    var stmt = db.prepare('INSERT INTO contacts VALUES (?,?)');
    stmt.run(fullName, number, function (err, row) {
      if (err) {
        console.log(chalk.blue.bold('Phone number or contact name already exists in contact list'));
      } else {
        console.log('Contact added succesfully');
      }
    })
    stmt.finalize();
  })

  db.close();
}
var checkValidName = (/^[a-zA-Z0-9]+$/);
var firstname = arr[1];
var lastname = arr[2];
var fullName;
var checkValidNum = (/^[0-9]+$/);
var number = arr[4];
if (arr.indexOf('-n') === -1) {
  console.log('missing -n tag please try again: node add -n <contact name> -p <Phonenumber> '.blue.bold);
  process.exit();
} else if (arr.indexOf('-n') !== 0) {
  console.log('-n argument placed in wrong position');
  process.exit();
} else {
  if (checkValidName.test(firstname) && checkValidName.test(lastname)) {
    fullName = firstname + ' ' + lastname;
  } else {
    console.log('invalid character present in name');
  }
}
if (arr.indexOf('-p') === -1) {
  console.log('please include -p tag');
  process.exit();
} else if (arr.indexOf('-p') !== 3) {
  console.log('-p argument placed in wrong position');
  process.exit();
} else {
  if (checkValidNum.test(number)) {
    if (number.length !== 11) {
      console.log('number is invalid');
      process.exit();
    } else {
      addContacts(fullName, number);
    }
  } else {
    console.log('number contains invalid characters: Please try again ');
    process.exit();
  }
}