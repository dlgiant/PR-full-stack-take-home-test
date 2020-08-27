module.exports = {
  mode: "development",
  entry: "./client/index.jsx",
  devtool: "eval-source-map",
  output: {
    filename: "./client/bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: [".js", ".jsx"],
        },
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
