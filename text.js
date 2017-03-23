var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('Database/newdb');
var inquirer = require('inquirer');
var request = require('request');
var arr = process.argv.slice(2);
function search (value) {
  var newarr = [];
  db.serialize(function () {
    var smt = db.prepare('SELECT name , phoneNumber FROM contacts WHERE name LIKE ?')
    smt.each(`%${value}%`, function (err, row) {
      if (err) {
        console.log('name not found') 
      }
      if (row) {
        newarr.push(row)
      }
    })
    setTimeout(() => {
      if (newarr.length === 0) {
        console.log('name does not exists in contact list')
      } else if (newarr.length === 1) {
        sendsms((newarr[0]['phoneNumber']), message)
      } else {
        console.log(`you have more than one person named ${value} `)
        for (var i = 0; i < newarr.length; i++) {
          console.log(`${i + 1}: ${newarr[i]['name']}`)
        }
        inquirer.prompt([{
          type: 'input',
          name: 'number',
          message: 'who do you want to send the message to ?',
          validate: function (value) {
            if (value > 0 && value <= newarr.length) {
              return true;
            } else {
              return 'please enter valid value';
            }
          }

        }]).then(function (answers) {
          sendsms(newarr[answers['number'] - 1]['phoneNumber'], message)
        })
      }
    }, 20)
  })
}

function sendsms (number, message) {
  var username = 'gbengajoloko'
  var password = 'joloko12'
  var sender = 'Oluwagbenga Joloko'
  var url = `http://smsmobile24.com/components/com_spc/smsapi.php?username=${username}&password=${password}&sender=${sender}&recipient=${number}&message=${message}`
  request(url, function (error, response, body) {
    if (error) {
      console.log('unexpected error occured')
    }
    if (response['body'] === 'OK 2.2') {
      console.log(`Message sent succesfully to ${number}`)
    } else {
      console.log('oops something went wrong some where please try again')
    }
  })
}
var message = arr[2]
if (!arr.length) {
  console.log('please include name and message')
  process.exit()
} else if (arr.indexOf('-m') === -1) {
  console.log('please include -m tag')
  process.exit()
} else if (arr.indexOf('-m') !== 1) {
  console.log('please put -m tag in the right position')
  process.exit()
} else if (!arr[2]) {
  console.log('please include message body')
  process.exit()
} else if (arr.length > 3) {
  console.log('plese include parenthesis in the message')
  process.exit()
} else {
  search(arr[0])
}