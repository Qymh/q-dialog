const path = require('path');
const os = require('os');
const Css = require('mini-css-extract-plugin');
const Vue = require('vue-loader/lib/plugin');
const Html = require('html-webpack-plugin');
const Progress = require('progress-bar-webpack-plugin');
const Friend = require('friendly-errors-webpack-plugin');
const resolve = str => path.resolve(process.cwd(), str);
const env = process.env.NODE_ENV;
const isDev = env === 'development';

const work = os.networkInterfaces();
const tips = [];
for (const key in work) {
  const item = work[key];
  const res = item.find(v => v.family === 'IPv4');
  if (res && res.address) {
    tips.push(`You application is running here http://${res.address}:7777`);
  }
}

const base = {
  mode: env,
  entry: {
    main: resolve('demo/index.js')
  },
  output: {
    path: resolve('demoDist'),
    filename: isDev ? '[name].js' : '[name].[contenthash].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          isDev
            ? 'vue-style-loader'
            : {
                loader: Css.loader,
                options: {
                  hmr: isDev
                }
              },
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          isDev
            ? 'vue-style-loader'
            : {
                loader: Css.loader,
                options: {
                  hmr: isDev
                }
              },
          'css-loader',
          'sass-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: '[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new Vue(),
    new Css({
      filename: isDev ? '[name].css' : '[name].[hash].css'
    }),
    new Html({
      template: resolve('demo/index.html')
    }),
    new Progress()
  ],
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }
};

if (env === 'development') {
  base.devServer = {
    host: '0.0.0.0',
    port: '7777',
    inline: true,
    noInfo: true,
    clientLogLevel: 'warning',
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/
    }
  };
  base.plugins.push(
    new Friend({
      compilationSuccessInfo: {
        notes: tips
      }
    })
  );
}

if (env === 'production') {
  base.optimization = {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial'
        },
        async: {
          priority: 5,
          chunks: 'async'
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    }
  };
}

module.exports = base;
