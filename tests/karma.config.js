const base = require('../build/webpack.test');
process.env.CHROME_BIN = require('puppeteer').executablePath();
module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    reporters: ['spec', 'coverage'],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack']
    },
    webpack: base,
    webpackMiddleware: {},
    specReporter: {
      showSpecTiming: true
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [{ type: 'lcov', subdir: '.' }, { type: 'text-summary' }],
      instrumenterOptions: {
        istanbul: { noCompact: true }
      }
    },
    port: 9876,
    colors: true,
    client: {
      mocha: {
        timeout: 4000
      }
    },
    browsers: ['ChromeHeadless']
  });
};
