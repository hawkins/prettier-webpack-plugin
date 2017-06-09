const webpack = require("webpack");
const PrettierPlugin = require("../index.js");
const uuid = require("uuid").v4;
const fs = require("fs");

const sampleCodeFilename = "./__tests__/sample-code.js";
const sampleCode = fs.readFileSync(sampleCodeFilename, { encoding: "utf8" });

const bundle = config => {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) return reject(err);

      const errors = stats.toString("errors-only");
      if (errors) return reject(errors);

      fs.readFile(config.entry, { encoding: "utf8" }, (err, code) => {
        if (err) return reject(err);

        let didFileUpdate = false;
        if (code !== sampleCode) didFileUpdate = true;
        if (!didFileUpdate) return reject("File did not change!");

        resolve(code);
      });
    });
  });
};

const prepareEntry = async (code, file) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, code, err => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const teardown = async files =>
  Promise.all(
    files.map(file => {
      return new Promise((resolve, reject) => {
        fs.unlink(file, err => {
          if (err) reject(err);
          else resolve();
        });
      });
    })
  );

describe("unit tests", () => {
  it("prettifies source", async () => {
    const input = `./temp/${uuid()}.js`;
    const output = `./temp/${uuid()}.js`;
    await prepareEntry(sampleCode, input);
    const processed = await bundle({
      entry: input,
      output: { filename: output },
      plugins: [new PrettierPlugin()]
    });
    expect(processed).toMatchSnapshot();
    return teardown([input, output]);
  });

  it("ignores unexpected config options in case they are for prettier", async () => {
    const input = `./temp/${uuid()}.js`;
    const output = `./temp/${uuid()}.js`;
    await prepareEntry(sampleCode, input);
    await bundle({
      entry: input,
      output: { filename: output },
      plugins: [new PrettierPlugin({ maybeForPrettier: true })]
    });
    return teardown([input, output]);
  });

  it("respects proper singleQuote config", async () => {
    const input = `./temp/${uuid()}.js`;
    const output = `./temp/${uuid()}.js`;

    await prepareEntry(sampleCode, input);
    let processed = await bundle({
      entry: input,
      output: { filename: output },
      plugins: [new PrettierPlugin({ singleQuote: true })]
    });
    expect(processed).toMatchSnapshot();

    await prepareEntry(sampleCode, input);
    processed = await bundle({
      entry: input,
      output: { filename: output },
      plugins: [new PrettierPlugin({ singleQuote: false })]
    });
    expect(processed).toMatchSnapshot();

    return teardown([input, output]);
  });

  it("errors on improper singleQuote config", async () => {
    const input = `./temp/${uuid()}.js`;
    const output = `./temp/${uuid()}.js`;

    await prepareEntry(sampleCode, input);
    expect(
      bundle({
        entry: input,
        output: { filename: output },
        plugins: [new PrettierPlugin({ singleQuote: () => null })]
      })
    ).rejects.toMatchSnapshot();

    return teardown([input]);
  });
});
