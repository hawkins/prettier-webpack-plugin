# Prettier Webpack Plugin

Process your source files with Prettier when Webpack runs!

## How it works

This plugin reads all file dependencies in your dependency graph.
If a file is found with a matching extension (`.js` and `.jsx` by default), the file is processed by Prettier and overwritten.

You can provide options Prettier by specifying them when creating the plugin.

## Installation

Simply run `npm install --save prettier-webpack-plugin` or `yarn add prettier-webpack-plugin` to install.

Then, in your Webpack config files, add the lines:

```JavaScript
var PrettierPlugin = require('../src');

module.exports = {
  // ... config settings here ...
  plugins: [
    new PrettierPlugin()
  ]
};

```

### API

The API is very simple.
The constructor accepts one argument, `options`, a JavaScript object which you can leverage to override any default behaviors.
You can specify any of [Prettier's options](https://github.com/jlongster/prettier#api) to override any of the defaults.

For instance, if you want a `tabWidth` of `4`, create your plugin like so:

```JavaScript
new PrettierPlugin({ tabWidth: 4 });
```

You can similarly specify which extensions to match and what encoding scheme to use when reading / writing files like so:

```JavaScript
new PrettierPlugin({ extensions: [ '.js' ], encoding: 'utf-16' });
```

### Example

A very basic example is included in the `/example` folder.
To see what this plugin can do, run `cd example && ./test.sh` in your terminal.
Notice how `entry.js` is now much prettier!
