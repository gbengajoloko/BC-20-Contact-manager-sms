var sqlite3 = require('sqlite3').verbose();
var inquirer = require('inquirer');
var db = new sqlite3.Database('Database/newdb');
function deletenum (number){
  console.log(number);
  db.serialize(function() {
  //db.run("CREATE TABLE IF NOT EXISTS contacts (name TEXT, phoneNumber INT)");
    var stmt=db.prepare('DELETE FROM contacts WHERE phoneNumber= ?');
    stmt.each(`${number}`);
    console.log('contact deleted succes fully')
    });
}
 //db.close();
function search (value) {
  var newarr = []
  db.serialize(function () {
 var smt=db.prepare("SELECT name , phoneNumber FROM contacts WHERE name LIKE ?");
    smt.each(`%${value}%`, function (err, row) {
      if (err) {
        console.log('name not found'); 
      }
      if (row) {
        newarr.push(row);
      }
    })
    smt.finalize();
    //db.close()
    setTimeout(() => {
      if (newarr.length === 0) {
        console.log('name does not exists in contact list');
      } else if (newarr.length === 1) {
        deletenum((newarr[0]['phoneNumber']));
      } else {
        console.log(`you have more than one person named ${value} `);
        for (var i = 0; i < newarr.length; i++) {
          console.log(`${i + 1}: ${newarr[i]['name']}`);
        }
        inquirer.prompt([{
          type: 'input',
          name: 'number',
          message: 'Which one of the above do you want to delete (enter number)?',
          validate: function (value) {
            if (value > 0 && value <= newarr.length) {
              return true;
            } else {
              return 'please enter valid value';
            }
          }

        }]).then(function (answers) {
          deletenum(newarr[answers['number'] - 1]['phoneNumber']);
        })
      }
    }, 20)
  })
};
var arr=process.argv.slice(2);
if (arr.length>2) {
  console.log('too many search parameters entereed');
  process.exit();
} else if (!arr.length) {
  console.log('enter name to delete augument');
  process.exit();
} else if ( arr[0] && arr[1]) {
  var val=arr.join(' ');
  search(val);
} else if (arr[0]!==undefined) {
  search(arr[0]);
}
//db.close()