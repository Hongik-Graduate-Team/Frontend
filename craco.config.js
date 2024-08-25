const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
      
      webpackConfig.module.rules.forEach((rule) => {
        if (rule.loader && rule.loader.includes('source-map-loader')) {
          rule.exclude = /node_modules/;
        }
      });

      return webpackConfig;
    },
  },
};
