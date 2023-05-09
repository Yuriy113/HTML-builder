const { readdir, readFile, writeFile, appendFile, copyFile, mkdir } = require('fs/promises');
const fs = require('fs');
const path = require('path');

// let header = '';
// let footer = '';
// let articles = '';

let HTMLComponents = {};

const readComponents = async () => {
  const components = await readdir(path.join(__dirname, 'components'));
  // console.log(components);

  // header = await readFile(path.join(__dirname, 'components', 'header.html'), {
  //   encoding: 'utf-8',
  // });
  // footer = await readFile(path.join(__dirname, 'components', 'footer.html'), {
  //   encoding: 'utf-8',
  // });
  // articles = await readFile(path.join(__dirname, 'components', 'articles.html'), {
  //   encoding: 'utf-8',
  // });

  for (let component of components) {
    // HTMLComponents[path.parse(component).name] = component;
    HTMLComponents[path.parse(component).name] = await readFile(
      path.join(__dirname, 'components', component),
      {
        encoding: 'utf-8',
      },
    );
  }
  // console.log(HTMLComponents);
};

const createFolder = async () => {
  fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
    if (err) throw err;
  });
};

const createHtmlBundle = async (files) => {
  const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
  let template = '';
  const stream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  stream.on('data', (chunk) => (template += chunk));
  stream.on('end', () => {
    // template = template
    //   .replace('{{header}}', header)
    //   .replace('{{footer}}', footer)
    //   .replace('{{articles}}', articles);
    for (let file in files) {
      template = template.replace(`{{${file}}}`, files[file]);
      // console.log(file.title);
      // console.log(file);
    }

    output.write(template);
  });
};

const createCssBundle = async () => {
  const destPath = path.join(__dirname, 'project-dist', 'style.css');
  const source = path.join(__dirname, 'styles');

  const createDir = async () => {
    writeFile(destPath, '', (err) => {
      if (err) console.log(err);
    });
  };

  const combineStyles = async () => {
    await createDir();
    const styles = await readdir(source);
    styles.forEach((style) => {
      if (path.extname(style) === '.css') {
        const input = fs.createReadStream(path.join(source, style));
        input.on('data', (chunk) => appendFile(destPath, chunk));
      }
    });
  };

  combineStyles();
};

const copyFolder = async (folderName) => {
  const filesToRemove = await readdir(folderName);

  for (let file of filesToRemove) {
    const pathToFile = folderName + path.sep + file;
    fs.stat(pathToFile, (err, stats) => {
      if (stats.isDirectory()) {
        // mkdir(path.join(__dirname, 'assets-copy', file), { recursive: true }, (err) => {
        mkdir(path.join(__dirname, 'project-dist', 'assets', file), { recursive: true }, (err) => {
          if (err) console.log(err);
        }).then(() => {
          copyFolder(pathToFile);
        });
      } else {
        const dest = 'project-dist' + path.sep + 'assets';
        // copyFile(pathToFile, pathToFile.replace('assets', 'assets-copy'));
        copyFile(pathToFile, pathToFile.replace('assets', dest));
      }
    });
  }
};

const createBundle = async () => {
  await createFolder();
  const pathToAssets = path.join(__dirname, 'assets');
  await copyFolder(pathToAssets);
  await readComponents();
  await createHtmlBundle(HTMLComponents);
  await createCssBundle();
};

createBundle();
