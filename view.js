var arr = process.argv.slice(2);
var sqlite3 = require('sqlite3').verbose();
var Table = require('easy-table');
var chalk = require('chalk');
var db = new sqlite3.Database('Database/newdb');
db.serialize(function () {
  db.run('CREATE TABLE IF NOT EXISTS contacts (name TEXT, phoneNumber INT)')
  db.each('SELECT rowid AS id,name,phoneNumber FROM contacts', function (err, row) {
    if (err) {
      console.log('an error occured please try again');
    } else {
      arr.push(row);
    }
  })
  setTimeout(() => {
    var t = new Table();

    arr.forEach(function (product) {
      t.cell('CONTACT NAME', product.name)
      t.cell(' PHONE NUMBER', product.phoneNumber)
      t.newRow()
    })

    console.log(chalk.red.bold(t.toString()));
  }, 20)
})
db.close();
