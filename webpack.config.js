const path = require("path");

module.exports = {
  resolve: {
    modules: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, './coder/frontend/'),
    ]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};