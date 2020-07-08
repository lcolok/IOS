import requireDir from "require-dir-all";
import path from "path";
import callerCallsite from "caller-callsite";

export const imaex = (inputExports, customConfig) => {
  const callerPath = path.dirname(callerCallsite().getFileName());
  const makingExports = {
    export_by_imaex: () => true,
  }; //基础自带识别key:export_by_imaex
  const preExports = {};
  let ignorePath = [];
  const defaultConfig = {
    // options
    recursive: true, // recursively go through subdirectories; default value shown
    indexAsParent: false, // add content of index.js/index.json files to parent object, not to parent.index
    includeFiles: /^.*\.(js)$/, // RegExp to select files; default value shown
    excludeDirs: /^(\.git|\.svn|node_modules)$/, // RegExp to ignore subdirectories; default value shown
    map: function (r) {
      // console.log(r.filepath);

      let currentPath = path.parse(r.filepath).dir;
      if (r.exports.export_by_imaex && r.exports.export_by_imaex()) {
        //ignore 带有 export_by_imaex 的文件夹下的所有文件
        if (currentPath !== callerPath) {
          //排除caller自己的路径,这个尽管带有"export_by_imaex"标签,但不能被忽略
          ignorePath.push(currentPath);
        }
        return;
      }
      Object.keys(r.exports).forEach((key) => {
        if (key == "default") {
          let newBase;
          if (r.base == "index") {
            let f = path.parse(r.filepath);
            newBase = path.parse(f.dir).base;
          } else {
            newBase = r.base;
          }
          preExports[newBase] = {
            exports: r.exports.default,
            path: currentPath,
          };
        } else {
          preExports[key] = { exports: r.exports[key], path: currentPath };
        }
      });
    },
  };

  Object.assign(defaultConfig, customConfig);

  requireDir(callerPath, defaultConfig);

  Object.keys(preExports).forEach((key) => {
    if (ignorePath.length == 0) {
      makingExports[key] = preExports[key].exports;
    } else {
      ignorePath.forEach((e) => {
        let thisPath = preExports[key].path;

        if (!thisPath.match(e)) {
          makingExports[key] = preExports[key].exports;
        }
      });
    }
  });

  if (inputExports) {
    Object.assign(inputExports, makingExports);
  }
  return makingExports;
};

export default imaex;

module.exports = imaex;
