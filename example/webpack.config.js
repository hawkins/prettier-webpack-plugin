var PrettierPlugin = require('../src');

module.exports = {
  plugins: [
    new PrettierPlugin({
      printWidth: 60,
      tabWidth: 5,
      useTabs: true,
      semi: false,
      singleQuote: true,
      trailingComma: 'all',
      bracketSpacing: false
    })
  ]
};
