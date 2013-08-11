/*

Gribbagrab
lovingly made by Evan Hahn
dedicated to burritos
unlicensed

Some implementation details:

- The gribbagrab function is intentionally plopped into the window namespace.
  This decision makes sense given the intended use case: it's meant to be
  inlined on your page. It's not meant to be loaded with another loader so it
  isn't AMD-compatible, nor is it meant to be CommonJS compatible. That's not
  to say you couldn't use Gribbagrab to load AMD-compatible stuff (even other
  loaders) -- go APESHIT. YOU CAN DO ANYTHING.

- "use strict" while you're developing, but not in the real world. It's an easy
  way to eliminate 13 characters.

- I'm cool with formal JSHint support, but JSLint is my enemy. I haven't added
  either, but you could submit a pull request. I'll love it.

- I thought about adding element.type = "text/javascript" or "text/css", but I
  figured that if you're using this, you're smart enough not to serve the wrong
  MIME types. I didn't want to add the extra bytes.

*/

;(function(win, doc) {

	// some cool configurations, baby
	var IMAGE_EXTENSIONS = ['.png', '.gif', '.jpg', '.jpeg', '.svg'];

	// document.head isn't always defined
	var head = doc.head || (doc.getElementsByTagName('head')[0]);

	// sometimes you want to do nothing
	var noop = function() {};

	// utility function to inject a .css or .js file
	var inject = function(src, options) {
		var element;
		var extension = src.substr(src.lastIndexOf('.'));
		if (extension === '.css') {
			element = doc.createElement('link');
			element.rel = 'stylesheet';
			element.src = src;
		} else if (IMAGE_EXTENSIONS.indexOf(extension) !== -1) {
			element = new Image;
			image.src = src;
		} else {
			element = doc.createElement('script');
			element.src = src;
		}
		element.onload = options.success || noop;
		element.onerror = options.failure || noop;
		head.appendChild(element);
	};

	// the big kahuna
	win.gribbagrab = function(dependencies, callback) {

		// so far, we have nothing to load, but we'll increment this
		var toLoad = 0;

		// nothing's failed so far, either
		var anythingFailed = false;

		dependencies.forEach(function(dependency) {

			// if it's "load X, then Y"...
			if (dependency instanceof Array) {
				toLoad += dependency.length;
				var done = function() {
					toLoad --;
					if (dependency.length)
						gribbagrab([dependency.shift()], done);
				};
				gribbagrab([dependency.shift()], done);
			}

			// if it's a single file, load only one of them
			else {
				toLoad ++;
				var srcs = dependency.split(/\W+/g);
				var tryNext = function() {
					if (srcs.length) {
						inject(srcs.shift(), {
							success: function() {
								toLoad --;
								if (toLoad === 0)
									callback(anythingFailed);
							},
							failure: tryNext
						});
					} else {
						anythingFailed = true;
						if (toLoad === 0)
							callback(anythingFailed);
					}
				};
				tryNext();
			}

		});

	};

})(window, document);
