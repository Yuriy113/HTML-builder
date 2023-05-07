const fs = require('fs/promises');
const fsPipe = require('fs');
const path = require('path');

const destPath = path.join(__dirname, 'project-dist', 'bundle.css');
const source = path.join(__dirname, 'styles');

const createDir = async () => {
  fs.writeFile(destPath, '', (err) => {
    if (err) console.log(err);
  });
};

const combineStyles = async () => {
  await createDir();
  const styles = await fs.readdir(source);
  styles.forEach((style) => {
    if (path.extname(style) === '.css') {
      const input = fsPipe.createReadStream(path.join(source, style));
      input.on('data', (chunk) => fs.appendFile(destPath, chunk));
    }
  });
};

combineStyles();
