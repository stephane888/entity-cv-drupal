const { defineConfig } = require("@vue/cli-service");
//const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV === "production" ? false : true;
module.exports = defineConfig({
  transpileDependencies: true,
  //Configuration de webpack.
  /**
   * On souhaite avoir la source map pour scss. Mais pour le moment, cela ne donne pas.
   * @param {*} config
   */
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      // mutate config for production...
    } else {
      config.devtool = devMode ? "inline-source-map" : "inline-source-map";
      //add plugins MiniExtractPlugin.
      // config.plugins.push(new MiniCssExtractPlugin());
      // generate sourceMap for scss.
      config.module.rules.push({
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true, // il est indispensable d'activer les sourcemaps pour que postcss fonctionne correctement
              implementation: require("sass"),
            },
          },
        ],
      });
      //on definie un domaine pour pouvoir tester les requetes sur drupal car localhost ne passe pas.
      config.devServer = {
        host: "cv-entity-vuejs.kksa",
        port: 8080,
        //https: true,
      };
    }
  },
  css: {
    loaderOptions: {
      css: {
        sourceMap: devMode === "production" ? false : false,
      },
      postcss: {
        // options here will be passed to postcss-loader
      },
    },
  },
  devServer: {
    // options here will be passed to postcss-loader
  },
});
