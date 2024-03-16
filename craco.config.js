const { whenProd } = require('@craco/craco');
const CracoAntDesignPlugin = require('craco-antd');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.optimization.splitChunks = {
        cacheGroups: {
          default: false,
          vendors: false,
          antdStyles: {
            name: 'antd',
            test: /antd\.css$/,
            chunks: 'all',
            enforce: true,
          },
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
        },
      };
      return webpackConfig;
    },
    plugins: [
      ...whenProd(
        () => [
          new TerserPlugin({
            terserOptions: {
              keep_fnames: true,
            },
          }),
        ],
        []
      ),
    ],
  },

  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeThemeLessPath: path.join(__dirname, 'src/styles/theme.less'),
      },
    },
  ],
};
