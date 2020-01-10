const rollup = require('rollup');
const postcss = require('rollup-plugin-postcss');
const babel = require('rollup-plugin-babel');
const vue = require('rollup-plugin-vue');
const fs = require('fs-extra');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const terser = require('terser');
const replace = require('rollup-plugin-replace');

const config = {
  es: {
    input: 'src/index.ts',
    output: {
      file: 'dist/q-dialog.esm.js',
      format: 'es'
    }
  },
  commonjs: {
    input: 'src/index.ts',
    output: {
      file: 'dist/q-dialog.common.js',
      format: 'cjs'
    }
  },
  umd: {
    input: 'src/index.ts',
    env: 'development',
    output: {
      file: 'dist/q-dialog.js',
      minFile: 'dist/q-dialog.min.js',
      cssFile: 'dist/q-dialog.css',
      cssMinFile: 'dist/q-dialog.min.css',
      format: 'umd',
      name: 'QDialog'
    }
  }
};

const rollupConfig = {
  plugins: [
    commonjs(),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    vue(),
    babel({
      exclude: /node_modules/,
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    postcss({
      extract: true,
      extensions: ['.css', '.scss']
    })
  ]
};

async function build() {
  for (const key in config) {
    const chunk = config[key];
    const configuration = {
      ...chunk,
      ...rollupConfig
    };
    if (key !== 'umd') {
      configuration.external = ['vue', '@vue/composition-api'];
    } else {
      configuration.external = ['vue'];
    }
    if (chunk.env) {
      configuration.plugins.unshift(
        replace({
          'process.env.NODE_ENV': JSON.stringify(chunk.env)
        })
      );
    }
    await rollup
      .rollup(configuration)
      .then(bundle => {
        return bundle.generate(chunk.output);
      })
      .then(output => {
        const js = output.output[0].code;
        const css = output.output[1].source.toString();
        fs.outputFileSync(chunk.output.file, js);
        if (key === 'umd') {
          const minified = terser.minify(js, {
            toplevel: true,
            output: {
              ascii_only: true
            },
            compress: {
              pure_funcs: ['makeMap']
            }
          }).code;
          fs.outputFileSync(chunk.output.minFile, minified);
          fs.outputFileSync(chunk.output.cssFile, css);
        }
      });
  }
}

build();
