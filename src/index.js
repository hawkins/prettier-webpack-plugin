const prettier = require("prettier");
const fs = require("fs");
const path = require("path");

module.exports = class PrettierPlugin {
  constructor(options) {
    options = options || {};

    // Encoding to use when reading / writing files
    this.encoding = options.encoding || "utf-8";

    // Only process these files
    this.extensions = options.extensions || [ ".js", ".jsx" ];

    // Override Prettier options if any are specified
    this.prettierOptions = {
      printWidth: options.printWidth,
      tabWidth: options.tabWidth,
      singleQuote: options.singleQuote,
      trailingComma: options.trailingComma,
      bracketSpacing: options.bracketSpacing,
      parser: options.parser
    };
  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      // Explore each chunk (build output):
      compilation.chunks.forEach(chunk => {
        // Explore each module within the chunk (built inputs):
        chunk.modules.forEach(module => {
          // Explore each source file path that was included into the module:
          module.fileDependencies.forEach(filepath => {
            // Read the file, format it, write it back to filepath
            if (this.extensions.indexOf(path.extname(filepath)) !== -1) {
              fs.readFile(filepath, this.encoding, (err, data) => {
                fs.writeFile(
                  filepath,
                  prettier.format(data, this.prettierOptions),
                  this.encoding,
                  err => {
                    if (err) throw err;
                  }
                );
              });
            }
          });
        });
      });

      callback();
    });
  }
};
