const glob = require('glob');
const path = require('path');
const fs = require('fs');
const docgen = require('react-docgen-typescript');
const reactScriptsWebPack = require('react-scripts/config/webpack.config');
const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000');
module.exports = {
  components: '**src/components/**/index.tsx**',
  ignore: ['**src/components/**/*.test.*'],
  propsParser: docgen.withCustomConfig('./tsconfig.json', {
    savePropValueAsString: true,
  }).parse,
  webpackConfig: Object.assign({}, reactScriptsWebPack, {
    module: {
      rules: [
        // All files with a ".ts" or ".tsx" extension will be handled by "awesome-typescript-loader".
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: imageInlineSizeLimit,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        // All output ".js" files will have any sourcemaps re-processed by "source-map-loader".
        // { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },

        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      ],
    },
  }),
};
