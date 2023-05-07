const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output, stdout } = require('process');

const rl = readline.createInterface({ input, output });

stdout.write('Please, type your message \n');
fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
  if (err) throw err;
});

rl.on('line', (text) => {
  if (text === 'exit') {
    rl.close();
  } else {
    fs.appendFile(path.join(__dirname, 'text.txt'), text, (err) => {
      if (err) throw err;
    });
  }
});

process.on('exit', () => stdout.write('Good luck in learning Node.js!'));
