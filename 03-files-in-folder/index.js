const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');

const origin = path.join(__dirname, 'secret-folder');

async function readFolder(pathToFolder) {
  try {
    const files = await readdir(pathToFolder);
    for (const file of files) {
      const filename = path.join(__dirname, 'secret-folder', file);
      const ext = path.extname(filename);
      fs.stat(filename, (err, stats) => {
        if (err) console.log(err);

        if (!stats.isDirectory()) {
          console.log(
            `${path.basename(file, ext)} - ${ext.replace('.', '')} - ${(stats.size / 1024).toFixed(
              3,
            )} kb`,
          );
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
}

readFolder(origin);
