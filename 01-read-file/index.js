const fs = require('fs');
const path = require('path');

let result = '';
const source = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(source, 'utf-8');

const readFile = () => {
  stream.on('data', (chunk) => (result += chunk));
  stream.on('end', () => console.log(result));
  stream.on('error', (err) => console.log(err));
};

readFile();
