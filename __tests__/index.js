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

describe("it passes unit tests", () => {
  it("runs with no config", done => {
    const filename = `./temp/${uuid()}.js`;
    webpack(
      Object.assign({}, defaultConfig, { output: { filename } }),
      (err, stats) => {
        fs.readFile(sampleCodeFilename, { encoding: "utf8" }, (err, code) => {
          if (err) throw err;

          const errors = stats.toString("errors-only");
          if (errors) console.warn(errors);

          let didFileUpdate = false;
          if (code !== sampleCode) didFileUpdate = true;

          fs.unlink(filename, err => {
            if (err) throw err;
          });

          fs.writeFile(sampleCodeFilename, sampleCode, err => {
            if (err) throw err;
          });

          if (didFileUpdate) done();
          else throw "File did not change!";
        });
      }
    );
  });
});
