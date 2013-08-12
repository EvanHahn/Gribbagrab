What is this gribbagrab!?
=========================

An asynchronous resource loader for people like me.

A preamble
----------

You can pretty much skip this rambling:

I'm going to be honest: I respectfully dislike RequireJS. Nobody _likes_ AMD, they just accept it. It's fugly. It requires extra work when loading non-AMD modules. It's big and powerful.

CommonJS implementations like Browserify are cool, but sometimes you _want_ to load your resources asynchronously. I'd rather load jQuery from a CDN than from something I concatenated. I'd also like fallback support in case the CDN is inaccessible for some reason.

And then there are simple loaders like Toast or my very own ScriptInclude. They're useful for small projects, but not ones with big dependencies. In ScriptInclude's case, for example, dependencies throw you into Callback Hell. Ain't nobody got time for that.

And then there's my favorite: _script tags_. The old-fashioned way. They're okay too, but (1) `async` and `defer` are a nightmare (2) you can't load CSS asynchronously (3) it's nowhere near as cool, let's face facts.

So, in a belligerent rage, I built Gribbagrab.

The use case
------------

I wanted my HTML to look like this (simplified, of course):

    <html>

      <head>
        <style>/* some inlined, initial styles */</style>
      </head>

      <body>
        <script>
        /* {{a small, inlined library for loading JS and CSS}} */
        var dependencies = ['full.css', 'jquery.js'];
        load(dependencies, function() {
          /* go for it sucka */
        })
        </script>
      </body>

    </html>

That's what Gribbagrab is built for.

The usage
---------

Here's how you use it:

    var dependencies = [

      // load some libraries in parallel
      'vendor/howler.js',
      'vendor/knockout.js',

      // load a library with fallbacks
      '//my_cdn.biz/jquery.js vendor/jquery.js',

      // load X, then Y
      // this supports the fallback syntax too
      ['underscore.js', 'backbone.js'],

      // load some CSS
      'vendor/bootstrap.css'

    ];

    // oh, do we need some polyfills?
    if (!window.JSON) {
      dependencies.push('vendor/json3.js');
    }

    // GO GO GRIBBAGRAB!
    gribbagrab(dependencies, function(anythingFailed) {
      if (anythingFailed) {
        // shit, uh...display an error?
      } else {
        // let's DO stuff
      }
    });

You'll need Array.prototype.forEach to get this to work. That's all good in new browsers, but old browsers need a shim.

More formally, I expose one function, called `gribbagrab`. It takes two arguments:

1. An array of things to load. For each element in the array...

   - If an element is a string, it'll load that resource. You can specify fallbacks by adding spaces: `try_this.js then_this.js finally_this.js`. Once one of them succeeds, it doesn't load the rest.
   - If an element is an array of strings, it'll load those scripts in order. These strings can be formatted like the above; you can use spaces to specify fallbacks.

2. A callback to execute when it's all done. You can also specify a file, which will run last. If you specify a callback, you'll be passed one boolean that tells you if anything screwed up in the loading process.

Epilogue
--------

Gribbagrab is licensed under the Unlicense.

Gribbagrab is dedicated to burritos. May you continue to delight us all.
