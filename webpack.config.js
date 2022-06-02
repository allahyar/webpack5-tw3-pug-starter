const path = require('path');
const PugPlugin = require('pug-plugin');

const buildPath = 'dist';
const PAGES = [
  'index',
  'test'
];
const entries = {};

PAGES.map((page) => {
  entries[page] = path.resolve(__dirname, `src/pages/${page}/${page}.pug`)
});

const config = {
  // You can define Pug files directly in entry.
  // The pug-plugin enable to use script and style source files directly in Pug.
  // Note: using PugPlugin the Entry Point is a Pug file, not a JS file.
  entry: entries,
  output: {
    path: path.join(__dirname, buildPath),
    publicPath: '/',
    // output filename of scripts
    filename: 'js/[name].[contenthash:8].js',
    clean: true, // remove unused bundled files
  },
  // Spin up a server for quick development
  plugins: [
    // enable processing of Pug files from entry
    new PugPlugin({
      pretty: true, // formatting HTML
      modules: [
        PugPlugin.extractCss({
          // output filename of styles
          filename: 'css/[name].[contenthash:8].css',
        }),
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
        options: {
          method: 'render'
        }
      },
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/i,
        use: ['css-loader', 'postcss-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, buildPath),
    },
    compress: true,
    // enable watching for live updates
    watchFiles: {
      paths: ['src/**/*.*'],
      options: {
        usePolling: true,
      },
    },
  },
};

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};