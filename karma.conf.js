// Karma configuration
// Generated on Sat Nov 08 2014 16:49:57 GMT-0800 (PST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'www',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      'lib/collide/collide.js',
      'lib/hammerjs/hammer.js',
      'io.js',
      'lib/angular/angular.js',
      'lib/angular-animate/angular-animate.js',
      'lib/angular-aria/angular-aria.js',
      'lib/angular-sanitize/angular-sanitize.js',
      'lib/angular-mocks/angular-mocks.js',
      'nightly.js',
      'lib/auth0-angular/build/auth0-angular.js',
      'lib/a0-angular-storage/dist/angular-storage.js',
      'lib/angular-jwt/dist/angular-jwt.js',
      'lib/auth0-lock/build/auth0-lock.js',
      'lib/angular-material/angular-material.js',
      'lib/angular-ui-router/release/angular-ui-router.js',

      'app/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Safari'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
