'use strict'

const colors = require('colors/safe');
const options = require('./options.json');
const readlineSync = require('readline-sync');

const calculator = require('./engine/calculator');

let currentRound = 1;
let exitLoop = false;

// setting up a prompt for user interface
while (!exitLoop) {
  const enquiry = readlineSync.question(
    `
${colors.green.bold('INPUT FORMAT: (no space between separators) < Available item_type: ' + options.products.toString() + ' >')}
${colors.yellow('<purchase_country>')}:${colors.blue('<optional_passport_number>')}:${colors.rainbow('<item_type>')}:${colors.cyan('<number_of_units_to_be_ordered>')}:${colors.rainbow('<item_type>')}:${colors.cyan('<number_of_units_to_be_ordered>')}

`
  );

  let result = calculator(enquiry);

  console.log(' ');

  if (result.success) {
    console.log(colors.green.underline(`OUTPUT ${currentRound++}: ${result.msg}`));
  } else {
    console.log(colors.red.underline(`OUTPUT ${currentRound++}: ${result.msg}`));
  }
  console.log(' ');
  const returnQuery = readlineSync.question(colors.blue('Do you want to place another enquiry? (yes/no): '));
  if (returnQuery == 'yes' || returnQuery == 'y') {
    continue;
  } else {
    exitLoop = true;
  }
}

console.log(colors.green('Have a great day!'));
