describe('Gribbagrab', function() {

	var done;

	var grabbed = function(expectedFailures) {
		if (expectedFailures == null) {
			expectedFailures = [];
		}
		return function(failures) {
			expect(failures).toEqual(expectedFailures);
			done = true;
		};
	};

	var wait = function(timeout) {
		if (timeout == null) {
			timeout = 1000;
		}
		waitsFor(function() {
			return done;
		}, 'the callback to have been called', timeout);
	};

	beforeEach(function() {
		done = false;
	});

	afterEach(function() {
		$('head *:not(.not-gribbagrab)').remove();
		delete window.grubba;
		delete window.tubba;
	});

	it('immediately calls the callback with no dependencies', function() {
		runs(function() {
			gribbagrab([], grabbed());
		});
		wait(10);
	});

	it('loads one JavaScript file successfully', function() {
		var src = 'loadables/small.js';
		runs(function() {
			gribbagrab([src], grabbed());
		});
		wait();
		runs(function() {
			expect($('script[src="' + src + '"]')).toExist();
			expect(window.grubba).toEqual('what is this gribbagrab');
		});
	});

	it('loads one CSS file successfully', function() {
		var src = 'loadables/small.css';
		runs(function() {
			gribbagrab([src], grabbed());
		});
		wait();
		runs(function() {
			expect($('link[href="' + src + '"]')).toExist();
			expect($('body')).toHaveCss({ 'margin-bottom': '-420px' });
		});
	});

	it('loads a few files successfully', function() {
		var dependencies = [
			'loadables/small.css',
			'loadables/small.js',
			'loadables/small2.js',
			'loadables/small2.css'
		];
		runs(function() {
			gribbagrab(dependencies, grabbed());
		});
		wait();
		runs(function() {
			expect($('script[src="loadables/small.js"]')).toExist();
			expect($('script[src="loadables/small2.js"]')).toExist();
			expect($('link[href="loadables/small.css"]')).toExist();
			expect($('link[href="loadables/small2.css"]')).toExist();
			expect(window.grubba).toEqual('what is this gribbagrab');
			expect(window.tubba).toEqual('blubba');
			expect($('body')).toHaveCss({ 'margin-bottom': '-420px' });
			expect($('html')).toHaveCss({ 'padding-bottom': '69px' });
		});
	});

	it('loads a few files successfully, given fallbacks', function() {
		var dependencies = [
			'FAILS loadables/small.css',
			'FAILS TOO loadables/small2.js',
			'loadables/small2.css loadables/small3.css',
			'ALSO FAILS loadables/small.js'
		];
		runs(function() {
			gribbagrab(dependencies, grabbed());
		});
		wait();
		runs(function() {
			expect($('script[src="loadables/small.js"]')).toExist();
			expect($('script[src="loadables/small2.js"]')).toExist();
			expect($('link[href="loadables/small.css"]')).toExist();
			expect($('link[href="loadables/small2.css"]')).toExist();
			expect($('link[href="loadables/small3.css"]')).not.toExist();
			expect(window.grubba).toEqual('what is this gribbagrab');
			expect(window.tubba).toEqual('blubba');
			expect($('body')).toHaveCss({ 'margin-bottom': '-420px' });
			expect($('html')).toHaveCss({ 'padding-bottom': '69px' });
		});
	});

	it('can load files in order', function() {
		var dependencies = [
			[
				'FAILS WOW loadables/dependent.js',
				'FAILS TOO loadables/dependency.js'
			]
		];
		runs(function() {
			gribbagrab(dependencies, grabbed());
		});
		wait();
		runs(function() {
			expect($('script[src="loadables/dependent.js"]')).toExist();
			expect($('script[src="loadables/dependency.js"]')).toExist();
			expect(window.grubba).toEqual(12);
			expect(window.tubba).toEqual(420);
		});
	});

	it('reports failures', function() {
		var dependencies = [
			'loadables/dependent.js',
			'this fails',
			'does not fail loadables/dependency.js'
		];
		runs(function() {
			gribbagrab(dependencies, grabbed(['this fails']));
		});
		wait();
	});

});
