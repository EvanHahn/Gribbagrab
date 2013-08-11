Gribbagrab
==========

I don't _trust_ RequireJS. AMD is _vile_. For large projects with complex dependencies, I get it. But for a small app where you only have a few dependencies, this lovely library might come in handy.

Here's how you use it:

    var dependencies = [

      // Load some libraries in parallel
      "vendor/howler.js",
      "vendor/knockout.js",

      // Load a library with fallbacks
      ["//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js", "vendor/jquery.js"],

      // Load X then Y
      "underscore.js backbone.js"

    ];

    grab(dependencies).then(function() {
      // let's DO some stuff
    });
