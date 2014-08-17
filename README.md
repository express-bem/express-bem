
bemhtml.js and bemtree.js express view engines
==============================================

A [bemhtml.js][] and [bemtree.js][] (by default) view engine for [Express][] :palm_tree:

[![Dependency Status](https://david-dm.org/zxqfox/express-bem.png)][status]

[Express]: https://github.com/visionmedia/express
[bemhtml.js]: https://github.com/bem/bem-core
[bemtree.js]: https://github.com/bem/bem-core
[status]: https://david-dm.org/zxqfox/express-bem

Why
---

Because laziness and short memory. And because simple solutions rocks.

And now it's just a `npm i express-bem` and 3 lines of code to use bem blocks library in any app.

Dependencies
------------

### Peer

[Express][] v3.0+

Installation
------------

```sh
$ npm i express-bem --save
```

Usage
-----

To _load_ and _init_ module you can use this snippet:

```js
var
  Express = require('express'),
  ExpressBem = require('express-bem'),

  // create app and bem
  app = Express(),
  bem = ExpressBem({
    projectRoot: '.',          // bem project root, used for bem make only
    path: './desktop.bundles', // path to your bundles
    cache: false               // to reload files each render
    cache: { make: false }     // to rebuild and reload files each render
  });

// and just use _all-in-one_
app.bem = bem.bindTo(app);
```

Or detailed (see also `ExpressBem.prototype.bindTo` method)

```js
app.bem = bem;

// register engines
app.engine('bemhtml.js', bem.expressViewEngine);
app.engine('bemtree.js', bem.expressViewEngine);
app.engine('bem', bem.expressViewEngine);
app.set('view engine', 'bem');

// here to lookup bundles at your path you need small patch
bem.patchView(app.get('view'));

if ('needAutoMake') {
  bem.use(bem.makeMiddleware({ verbosity: 'debug' }));
}
```

And then just use `res.render` (or `app.render`) in your code and pass
`bemjson` tree there

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
    param: 1
  }
});
```

Directories
-----------

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
to your `views` path and use them with default `View.lookup`.

```
.
├── app.js
└── views
    ├── index.bemhtml.js
    ├── index.bemtree.js
    ├── layout.bemhtml.js
    └── layout.bemtree.js
```

License
-------

MIT. See also [License][]

[License]: https://github.com/zxqfox/express-bem/blob/master/LICENSE
