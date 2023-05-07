const fs = require('fs/promises');
const path = require('path');

const origin = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');

const makeDirectory = async (dest) => {
  fs.mkdir(dest, { recursive: true });
};

async function copyDir(source, destination) {
  await makeDirectory(dest);
  const filesToRemove = await fs.readdir(dest);
  if (filesToRemove) {
    filesToRemove.forEach((file) => fs.unlink(path.join(dest, file)));
  }

  const files = await fs.readdir(source);
  for (const file of files) {
    fs.copyFile(path.join(source, file), path.join(destination, file));
  }
}

copyDir(origin, dest);
