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
  constructor(options) {
    options = options || {};

    // Encoding to use when reading / writing files
    this.encoding = options.encoding || DEFAULT_ENCODING;
    delete options.encoding;

    // Only process these files
    this.extensions = options.extensions || DEFAULT_EXTENSIONS;
    delete options.extensions;

    // Override Prettier options if any are specified
    this.prettierOptions = options;
  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      // Explore each chunk (build output):
      compilation.chunks.forEach(chunk => {
        // Explore each module within the chunk (built inputs):
        chunk.forEachModule(module => {
          if (!module.fileDependencies) return;

          // Explore each source file path that was included into the module
          module.fileDependencies.forEach(filepath => {
            // If it matches
            if (this.extensions.indexOf(path.extname(filepath)) !== -1) {
              // Read the file
              fs.readFile(filepath, this.encoding, (err, source) => {
                // Format via prettier
                var prettierSource = prettier.format(
                  source,
                  this.prettierOptions
                );

                // Rewrite file if prettier returned different source
                if (prettierSource !== source) {
                  fs.writeFile(filepath, prettierSource, this.encoding, err => {
                    if (err) throw err;
                  });
                }
              });
            }
          });
        });
      });

      callback();
    });
  }
};
