const fs = require('fs');

const toPascalCase = (fileName) => fileName
  .split('-')
  .map((name) => name[0].toUpperCase() + name.substr(1))
  .join('');

const jsContent = (fileName) => `const ${toPascalCase(fileName)} = () => (
  <div className="${fileName}">New component!</div>
);

export default ${toPascalCase(fileName)};
`;

const scssContent = (fileName) => `.${fileName} {}
`;

const scssImport = (fileName) => `
@import 'components/${fileName}/${fileName}';`;

const component = () => {
  const componentName = process.argv.slice(2)[0] || 'new-component';
  const componentFileName = componentName.toLowerCase();
  const componentDirectory = `components/${componentFileName}`;
  const componentPath = `${componentDirectory}/${componentFileName}`;

  if (!componentName) {
    console.log('Invalid component name!');
    return;
  }

  fs.mkdirSync(componentDirectory);

  fs.appendFile(`${componentPath}.scss`, scssContent(componentFileName), (err) => {
    if (err) throw err;
    console.log(`💅 SCSS: Created ${componentFileName}.scss file.`);
  });

  fs.appendFile('scss/main.scss', scssImport(componentFileName), (err) => {
    if (err) throw err;
    console.log(`💅 SCSS: Auto-import ${componentFileName}.scss file.`);
  });

  fs.appendFile(`${componentPath}.js`, jsContent(componentFileName), (err) => {
    if (err) throw err;
    console.log(`⚛️  JS: Created ${componentFileName}.js file.`);
  });

  console.log('WOOT! ✨');
};

// init
component();
