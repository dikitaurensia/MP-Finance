module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules\/(?!recharts|es-toolkit|immer|@reduxjs\/toolkit)/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: [
            "@babel/plugin-proposal-optional-chaining",
            "@babel/plugin-proposal-nullish-coalescing-operator"
          ]
        }
      }
    }
  ]
}
