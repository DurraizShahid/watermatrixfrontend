const upstreamTransformer = require('metro-react-native-babel-transformer');
const cssTransformer = require('react-native-css-transformer');

module.exports.transform = async ({src, filename, options}) => {
  if (filename.endsWith('.css')) {
    return cssTransformer.transform({src, filename, options});
  }
  return upstreamTransformer.transform({src, filename, options});
};