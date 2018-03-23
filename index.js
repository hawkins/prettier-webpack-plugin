const prettier = require("prettier");
const fs = require("fs");
const path = require("path");

const DEFAULT_EXTENSIONS = prettier.getSupportInfo
  ? prettier
      .getSupportInfo()
      .languages.map(l => l.extensions)
      .reduce((accumulator, currentValue) => accumulator.concat(currentValue))
  : [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".css",
      ".less",
      ".scss",
      ".sass",
      ".graphql",
      ".json"
    ];

const DEFAULT_ENCODING = "utf-8";

module.exports = class PrettierPlugin {
  constructor(options, pluginOptions) {
    options = options || {};

    // Encoding to use when reading / writing files
    this.encoding = options.encoding || DEFAULT_ENCODING;
    delete options.encoding;

    // Only process these files
    this.extensions = options.extensions || DEFAULT_EXTENSIONS;
    delete options.extensions;

    // Override Prettier options if any are specified
    this.prettierOptions = options;
    this.pluginOptions = pluginOptions || {};
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('Prettier', (compilation, callback) => {

    const promises = [];
    compilation.fileDependencies.forEach(filepath => {
      if (this.extensions.indexOf(path.extname(filepath)) === -1) {
        return;
      }

      promises.push(new Promise((resolve, reject) => {
        fs.readFile(filepath, this.encoding, (err, source) => {
          if (err) {
              return reject(err);
          }
          const prettierSource = prettier.format(source, this.prettierOptions);
          if (prettierSource !== source) {
            fs.writeFile(filepath, prettierSource, this.encoding, err => {
              if (err) {
                return reject(err);
              }
              resolve();
            });
          } else {
            resolve();
          }
        });
      }));
    });

    Promise.all(promises).then(() => {
        callback();
      });
    });
  }
};
