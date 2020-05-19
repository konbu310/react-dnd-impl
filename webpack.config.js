const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");

module.exports = {
  output: {
    path: path.join(__dirname, "docs"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, "src/index.html"),
    }),
  ],
};
