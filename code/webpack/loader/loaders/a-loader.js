/**
 *
 * @param {string|Buffer} content 源文件的内容
 * @param {object} [map] 可以被 https://github.com/mozilla/source-map 使用的 SourceMap 数据
 * @param {any} [meta] meta 数据，可以是任何内容
 */
function webpackLoader(content, map, meta) {
  console.log('开始执行 aLoader Normal Loader');
  content += 'aLoader]';
  return `module.exports = '${content}'`;
}

webpackLoader.pitch = function (remainingRequest, precedingRequest, data) {
  console.log('开始执行 aLoader Pitch Loader');
  console.log('remainingRequest: ', remainingRequest);
  console.log('precedingRequest: ', precedingRequest);
  console.log('data', data);
};

module.exports = webpackLoader;
