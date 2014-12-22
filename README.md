
# express-bem [![Build Status](https://travis-ci.org/express-bem/express-bem.svg)](https://travis-ci.org/express-bem/express-bem) [![Dependency Status](https://david-dm.org/express-bem/express-bem.png)](https://david-dm.org/express-bem/express-bem)

[BEM][] bundles render adapter for [express][] :palm_tree:

[express]: https://github.com/visionmedia/express
[BEM]: http://bem.info/

## Why

Because laziness and short memory. And because simple solutions rocks.

And now it's just a `npm i express-bem` and 3 lines of code to use bem blocks library in any app.

## Plugins

- [express-bem-bemtree](https://github.com/express-bem/bemtree)
- [express-bem-bemhtml](https://github.com/express-bem/bemhtml)
- [express-bem-tools-make](https://github.com/express-bem/tools-make) bem-tools make middleware

## Dependencies

### Peer

[express][] v3.0+

## Installation

```sh
$ npm i express-bem --save
```

## Usage

To _load_ and _init_ module you can use this snippet:

```js
var Express = require('express');
var ExpressBem = require('express-bem');

// create app and bem
var app = Express();
var bem = ExpressBem({
  projectRoot: './path-to/bem-project', // bem project root, used for bem make only
  path: './custom.bundles'             // path to your bundles
});

// here to lookup bundles at your path you need small patch
app.bem = bem.bindTo(app);

// register engines
bem.usePlugin('express-bem-bemtree'); // requires module express-bem-bemtree
bem.usePlugin('express-bem-bemhtml'); // ... express-bem-bemhtml
```

Allowed options for `cache` param object are:
- `load` if set to `false` will reload any template files each time
- `exec` if set to `false` will exec template files each time

But also can be set to boolean.

Examples:
```js
var bem = ExpressBem({
  cache: {
    load: true, // don't reload
    exec: false // but execute with context
  }
});

var cachingbem = ExpressBem({
  cache: true // cache all
});
```

Also you can add your custom engine
```js
bem.engine('.bh.js', function (name, options, cb) {
  // some custom .bh.js realisation
  cb(null, 'result');
});
```

Or even more complex
```js
bem.engine('fullstack', '.bem', ['.bemhtml.js', '.bemtree.js'], function (name, options, cb) {
  var view = this;

  // pass options.bemjson directly to bemhtml
  if (options.bemjson) return view.thru('bemhtml');

  // return bemjson if requested
  if (options.raw === true) return view.thru('bemtree');

  // full stack
  view.thru('bemtree', name, options, function (err, bemjson) {
    if (err) return cb(err);

    options.bemjson = bemjson;
    view.thru('bemhtml', name, options, function (err, data) {
      if (err) return cb(err);
      cb(null, data);
    });
  });
});
```

See also `ExpressBem.prototype.bindTo` method.

And then just use `res.render` (or `app.render`) in your code and pass
some data (or `bemjson` tree) there:

```js
app.get('/', function (req, res) {
  res.render('your-bundle', {
    bemjson: { // view-oriented bemjson tree here
      block: 'page',
      content: [
        'Hello!'
      ]
    }
  }
});
```

Or raw data to execute `bemtree`

```js
app.get('/', function (req, res) {
  res.render('your-bundle', {
    title: 'Cool story #1',
    storyId: req.query.id,
    story: {title: 'Cool', content: '... Lorem Ipsum ...'}
  });
});
```

## Directories

If you want to use your `bem` repo you can just pull it with `git` submodules
or install as `npm` package and then just use it as your special bundles path.

```
.
├── app.js
└── node_modules
    └── my-super-mockup
        ├── desktop.blocks
        │   └──...
        └── desktop.bundles
            ├── index
            │   ├── index.bemhtml.js
            │   └── index.bemtree.js
            └── layout
                ├── layout.bemhtml.js
                └── layout.bemtree.js
```

Otherwise you can import somehow `bemhtml.js` and/or `bemtree.js` files
to your `views` path and use them with default `View.prototype.lookup`.

```
.
├── app.js
└── views
    ├── index.bemhtml.js
    ├── index.bemtree.js
    ├── layout.bemhtml.js
    └── layout.bemtree.js
```

## Plugins, engines, middlewares

### Engine

Very simple async render engine

```js
/**
 * At least one name/ext definition required in params or engine
 * @method engine
 * @param {String} [name] optional name of engine
 * @param {String} [ext] optional extension of engine
 * @param {Object|Function} engine can be function or object with render, name, extension properties
 */

// canonical
bem.engine('even-simpler', '.espl.js', function (name, options, cb) {
  cb(null, 'rendered result');
});

// name will be espl
bem.engine('.espl.js', function (name, options, cb) {
  cb(null, 'rendered result');
});

// ext will be .espl.js
bem.engine('espl', function (name, options, cb) {
  cb(null, 'rendered result');
});

// via function
function evenSimpler(name, options, cb) {
  cb(null, 'rendered result');
}
evenSimpler.extension = '.espl.js';
bem.engine(evenSimpler);

// via blackbox (function/object)
bem.engine(require('express-bem-even-simpler-engine'));

// via object
bem.engine({
  extension: '.blo.js', // name will be 'blo'
  targetExtensions: ['.blo.js'],
  render: function (name, options, cb) {
    cb(null, 'rendered result');
  }
});
```

You should know that you should set by self default engine if you don't use `.bindTo` method.

Like that:

```js
// set first available engine as default
app.set('view engine', bem.defaultViewEngine);

// set concrete default engine
app.set('view engine', '.espl.js');
```

### Middleware

Middlewares usually calls betweed express' `View.prototype.render` and engine's `.render`.

```js
/**
 * @method use
 * @param {Function} middleware depends on arity it can be generator or middleware itself
 * @param {Object} opts options passed to middlewares
 */

// using as simple middleware
bem.use(function (ctx, next) {
  // current view
  var view = this;

  // slow down render
  setTimeout(next, 2000);
});

// using as generator
bem.use(function (opts) {
  // expressBem context
  var bem = this;

  /**
   * @param {Object} ctx Object with name, options, cb properties that can be modified
   * @param {Function} next done callback
   */
  return function (ctx, next) {

    // dump current extension and passed name to render
    console.log(this.ext, ctx.name);

    // fixup context
    ctx.options.raw = 1;

    // all is fine go ahead
    next();
  };
})
```

### Plugin interface

It should have `engines` (`engine` if one) and/or `middlewares` (`middleware`) properties.

To load plugin into `express-bem` instance just call `usePlugin` method with some parameters:

```js
/**
 * @method usePlugin
 * @param {String|Object|Function} plugin name, object or generator
 * @param {Object} opts options passed to middlewares
 */

// by module require
bem.usePlugin(require('express-bem-module-name'), { /* options */ });

// by object declaration
bem.usePlugin({
  middleware: function (opts) { // middleware generator
    return function (ctx, next) {
      console.log(ctx.options);
      next();
    };
  }
}, { /* options for middleware */ });

// by function generator
bem.usePlugin(function () { // plugin generator
  return {
    engines: [{
      extension: '.q.js',
      render: function (name, options, cb) {
        cb(null, name);
      }
    }, {
      extension: '.w.js',
      render: function (name, options, cb) {
        cb(null, this.ext);
      }
    }]
  };
});
```

## License

MIT. See also [License][]

[License]: https://github.com/express-bem/express-bem/blob/master/LICENSE
