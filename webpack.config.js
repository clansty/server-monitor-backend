const path = require('path')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const copyFromSrc = path => {
  const outPath = `src/${path}`
  return { from: outPath, to: outPath }
}

const webpackConfig = {
  entry: './src/index.ts',
  mode: "production",
  target: 'node',
  optimization: {
    minimize: true,
    usedExports: true
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin,
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, 'dist')
  }
}

module.exports = webpackConfig
