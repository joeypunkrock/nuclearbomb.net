const path = require("path");
const glob = require("glob");
const PugPlugin = require("pug-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  function buildPlugins() {
    const devPlugins = [];

    const prodPlugins = [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              jpeg: {
                quality: 70,
              },
              png: {
                quality: 70,
              },
            },
          },
        },
      }),
    ];

    if (!isProd) {
      return devPlugins;
    } else {
      return prodPlugins;
    }
  }

  function generateEntryPages() {
    const entry = {};

    // Use glob to find all Pug files in the specified directory
    const files = glob.sync("src/views/web/pages/**/*.pug");

    // Loop through the found files and generate entry points
    files.forEach((filePath) => {
      // Extract the relative path without the '.pug' extension
      const relativePath = path.relative("src/views/web/pages", filePath).replace(".pug", "");

      // Check and Assign 'home' or '404' to root using backslashes
      if (relativePath === "home\\index") {
        entry["index"] = filePath;
      } else if (relativePath === "404\\index") {
        entry["404"] = filePath;
      } else {
        // Use the directory structure as the entry key with backslashes
        entry[relativePath.replace(/\\/g, "/")] = filePath;
      }
    });

    return entry;
  }

  const entryPages = generateEntryPages();

  return {
    mode: isProd ? "production" : "development",
    devtool: isProd ? "source-map" : "inline-source-map",
    stats: "minimal",

    entry: entryPages,

    output: {
      path: path.join(__dirname, "dist"),
      publicPath: isProd ? "auto" : "/",
      clean: true,
    },

    resolve: {
      alias: {
        Views: path.join(__dirname, "src/views/"),
        Images: path.join(__dirname, "src/assets/images/"),
        Fonts: path.join(__dirname, "src/assets/fonts/"),
        Styles: path.join(__dirname, "src/assets/styles/"),
        Scripts: path.join(__dirname, "src/assets/scripts/"),
      },
    },

    plugins: [
      // enable processing of Pug files from entry
      new PugPlugin({
        //verbose: !isProd, // output information about the process to console
        pretty: !isProd, // formatting of HTML
        js: {
          // output name of a generated JS file
          filename: "assets/js/[name].[contenthash:8].js",
        },
        css: {
          // output filename of styles
          filename: "assets/css/[name].[contenthash:8].css",
        },
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "src/assets/images",
            to: `assets/images`,
          },
          // {
          //   from: "src/assets/videos",
          //   to: `assets/videos`,
          // },
        ],
      }),
    ].concat(buildPlugins),

    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: PugPlugin.loader,
          options: {
            // enable filters only those used in pug
            embedFilters: {
              // :escape
              escape: true,
              // :code
              code: {
                className: "language-",
              },
              // :highlight
              highlight: {
                verbose: !isProd,
                use: "prismjs", // name of a highlighting npm package, must be extra installed
              },
            },
          },
        },

        {
          test: /\.(json|geojson)$/i,
          type: "asset/resource",
          include: /data/,
          generator: {
            filename: "data/[name].[contenthash][ext]",
          },
        },

        // styles
        {
          test: /\.(css|sass|scss)$/,
          use: ["css-loader", "postcss-loader", "sass-loader"],
        },

        // fonts
        {
          test: /\.(woff2?|ttf|otf|eot|svg)$/,
          type: "asset/resource",
          include: /assets[\\/]fonts/, // fonts from `assets/fonts` directory only, match posix and win paths
          generator: {
            // output filename of fonts
            filename: "assets/fonts/[name][ext][query]",
          },
        },

        // images
        {
          test: /\.(png|svg|jpe?g|webp)$/i,
          resourceQuery: { not: [/inline/] }, // ignore images with `?inline` query
          type: "asset/resource",
          include: /assets[\\/]images/, // images from `assets/images` directory only, match posix and win paths
          generator: {
            // output filename of images
            filename: "assets/images/[name].[ext]",
          },
        },

        // icons
        {
          test: /\.(svg)$/i,
          resourceQuery: { not: [/inline/] }, // ignore images with `?inline` query
          type: "asset/resource",
          include: /assets[\\/]icon/, // svgs from `assets/icon` directory only, match posix and win paths
          generator: {
            // output filename of images
            filename: "assets/icon/[name].[ext]",
          },
        },

        // inline images: png or svg icons with size < 4 KB
        {
          test: /\.(png|svg)$/i,
          type: "asset",
          include: /assets[\\/]images/,
          exclude: /favicon/, // don't inline favicon
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024,
            },
          },
        },

        // force inline svg file containing `?inline` query
        {
          test: /\.(svg)$/i,
          resourceQuery: /inline/,
          type: "asset/inline",
        },
      ],
    },

    performance: {
      hints: isProd ? "error" : false,
      // in development mode the size of assets is bigger than in production
      maxEntrypointSize: isProd ? 1024000 : 4096000,
      maxAssetSize: isProd ? 1024000 : 4096000,
      assetFilter: function (assetFilename) {
        // Exclude files in 'demo/' directory and its subdirectories
        return !/demo\//.test(assetFilename);
      },
    },

    devServer: {
      proxy: {
        "/api": "http://localhost:3000",
      },
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      open: true, // open in default browser
      watchFiles: {
        paths: ["src/**/*.*"],
        options: {
          usePolling: true,
        },
      },
    },

    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            enforce: true,
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
          extractComments: true,
        }),
      ],
    },
  };
};
