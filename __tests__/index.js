const webpack = require("webpack");
const PrettierPlugin = require("../index.js");
const uuid = require("uuid").v4;
const fs = require("fs");

const sampleCodeFilename = "./__tests__/sample-code.js";
const sampleCode = fs.readFileSync(sampleCodeFilename, { encoding: "utf8" });

const defaultConfig = {
  entry: sampleCodeFilename,
  plugins: [new PrettierPlugin()]
};

const bundle = config => {
  return new Promise((resolve, reject) => {
    webpack(Object.assign({}, defaultConfig, config), (err, stats) => {
      if (err) return reject(err);

      const errors = stats.toString("errors-only");
      if (errors) return reject(errors);

      fs.readFile(sampleCodeFilename, { encoding: "utf8" }, (err, code) => {
        if (err) return reject(err);

        fs.writeFile(sampleCodeFilename, sampleCode, err => {
          if (err) return reject(err);
        });

        fs.unlink(config.output.filename, err => {
          if (err) return reject(err);
        });

        let didFileUpdate = false;
        if (code !== sampleCode) didFileUpdate = true;
        if (!didFileUpdate) return reject("File did not change!");

        resolve();
      });
    });
  });
};

describe("it passes unit tests", () => {
  it("runs with no config", () => {
    const filename = `./temp/${uuid()}.js`;
    return bundle({ output: { filename } });
  });
});
