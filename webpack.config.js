const path = require('path');
const PugPlugin = require('pug-plugin');

const buildPath = 'dist';

const config = {
  // You can define Pug files directly in entry.
  // The pug-plugin enable to use script and style source files directly in Pug.
  // Note: using PugPlugin the Entry Point is a Pug file, not a JS file.
  entry: {
    index: './src/pages/index/index.pug'
  },
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

  resolve: {
    alias: {
      '@components': path.join(__dirname, 'src/views/'),
      '@images': path.join(__dirname, 'src/assets/images/'),
      '@fonts': path.join(__dirname, 'src/assets/fonts/'),
      '@css': path.join(__dirname, 'src/assets/css/'),
      '@js': path.join(__dirname, 'src/assets/js/'),
    }
  },
  
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
        test: /\.(css|sass|scss)$/,
        use: ['css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|jpeg|svg|ico)$/i,
        type: 'asset/resource', // this is very important
        generator: {
          // output filename of images
          filename: 'assets/images/[name].[hash:8][ext]',
        },
      },
      {
        test: /\.(woff2|woff|ttf|svg|eot)/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
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
