import requireDir from "require-dir-all";
import path from "path";
import callerCallsite from "caller-callsite";

export const imaex = (inputExports, customConfig) => {
  const makingExports = {};
  const defaultConfig = {
    // options
    recursive: true, // recursively go through subdirectories; default value shown
    indexAsParent: false, // add content of index.js/index.json files to parent object, not to parent.index
    includeFiles: /^.*\.(js)$/, // RegExp to select files; default value shown
    excludeDirs: /^(\.git|\.svn|node_modules)$/, // RegExp to ignore subdirectories; default value shown
    map: function(r) {
      Object.keys(r.exports).forEach(key => {
        if (key == "default") {
          let newBase;
          if (r.base == "index") {
            let f = path.parse(r.filepath);
            newBase = path.parse(f.dir).base;
          } else {
            newBase = r.base;
          }
          makingExports[newBase] = r.exports.default;
        } else {
          makingExports[key] = r.exports[key];
        }
      });
    }
  };

  Object.assign(defaultConfig, customConfig);
  requireDir(path.dirname(callerCallsite().getFileName()), defaultConfig);
  Object.assign(inputExports, makingExports);
};

export default imaex;
