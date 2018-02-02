var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: "./src/ts/index.tsx",
    output: {
        filename: "bundle.js",
        publicPath: "/build/",
        path: __dirname + "/build/js"
    },

    plugins: [
      new CopyWebpackPlugin([
          { from: __dirname + '/src/www', to: __dirname + '/build' },
          { from: __dirname + '/src/lib', to: __dirname + '/build/lib' }
       ])
    ],

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    devServer: {
      inline: true,
      contentBase: './build',
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    }
};
