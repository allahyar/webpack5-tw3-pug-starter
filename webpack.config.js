const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';

const PAGES = [
  'index',
  'test'
];

const config = {
  entry: (() => {
    const entries = {};
    PAGES.forEach(page => entries[page] = path.resolve(__dirname, `src/pages/${page}/${page}.js`));
    return entries;
  })(),
  output: {
    path: path.build,
    filename: 'js/[name].js',
    clean: true, // remove unused bundled files
  },
  // Spin up a server for quick development
  plugins: [
    // new MiniCssExtractPlugin({
    //   filename: 'styles/[name].css',
    //   chunkFilename: 'styles/[id].css',
    // }),
    // new CopyPlugin({
    //   patterns: [{ from: './src/fonts', to: 'fonts' }]
    // }),
    ...PAGES.map((page) => new HtmlWebpackPlugin({
      template: path.resolve(__dirname, `src/pages/${page}/${page}.pug`),
      filename: `${page}.html`,
      chunks: ['common', page],
      // inject: 'body'
    }))
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader',
      }
    ]
  }
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};