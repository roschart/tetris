module.exports = {
  entry: './src/tetris.js',
  output: {
    path: './build',
    publicPath: '/assets/',
    filename: 'tetris.min.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
}
