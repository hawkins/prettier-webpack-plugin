# Prettier Webpack Plugin

Automatically process your source files with Prettier when Webpack runs.

## How it works

This plugin reads all file dependencies in your dependency graph.
If a file is found with a matching extension (`.js` and `.jsx` by default), the file is processed by Prettier and overwritten.

You can provide options Prettier by specifying them when creating the plugin.

## Installation

Simply run `npm install --save-dev prettier-webpack-plugin` or `yarn add --dev prettier-webpack-plugin` to install.

Then, in your Webpack config files, add the lines:

```JavaScript
var PrettierPlugin = require('../src');

module.exports = {
  // ... config settings here ...
  plugins: [
    new PrettierPlugin()
  ],
};

```

### Why?

Keeping style consistent between programmers new to collaboration can be tricky.
Prettier tackles this problem by formatting your code to fit its preferred style, which is admittedly very pretty.
Now, your code is automatically formatted when you bundle with Webpack.

Perfect for group projects bundling code on save!

### Usage

The API is very simple.
The constructor accepts one argument, `options`, a JavaScript object which you can leverage to override any default behaviors.
You can specify any of [Prettier's options](https://github.com/jlongster/prettier#api) to override any of the defaults.

For the most basic example, simple add this in your `webpack.config.js`:

```JavaScript
plugins: [
  new PrettierPlugin()
],
```

**This is equivalent to**:

```JavaScript
plugins: [
  new PrettierPlugin({
    // Fit code within this line limit
    printWidth: 80,

    // Number of spaces it should use per tab
    tabWidth: 2,

    // If true, will use single instead of double quotes
    singleQuote: false,

    // Controls the printing of trailing commas wherever possible
    trailingComma: false,

    // Controls the printing of spaces inside array and objects
    bracketSpacing: true,

    // Which parser to use. Valid options are 'flow' and 'babylon'
    parser: 'babylon',

    // Which encoding scheme to use on files
    encoding: 'utf-8',

    // Which file extensions to process
    extensions: [ ".js", ".jsx" ]
  })
],
```

### Example

A very crude example is included in the `/example` folder.
To see what this plugin can do, run `cd example && ./test.sh` in your terminal.
Notice how `entry.js` is now much prettier!
