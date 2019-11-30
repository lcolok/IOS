"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.imaex = undefined;

var _requireDirAll = require("require-dir-all");

var _requireDirAll2 = _interopRequireDefault(_requireDirAll);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _callerCallsite = require("caller-callsite");

var _callerCallsite2 = _interopRequireDefault(_callerCallsite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var imaex = exports.imaex = function imaex(inputExports, customConfig) {
  var callerPath = _path2.default.dirname((0, _callerCallsite2.default)().getFileName());
  var makingExports = {
    export_by_imaex: function export_by_imaex() {
      return true;
    }
  }; //基础自带识别key:export_by_imaex
  var preExports = {};
  var ignorePath = {};
  var defaultConfig = {
    // options
    recursive: true, // recursively go through subdirectories; default value shown
    indexAsParent: false, // add content of index.js/index.json files to parent object, not to parent.index
    includeFiles: /^.*\.(js)$/, // RegExp to select files; default value shown
    excludeDirs: /^(\.git|\.svn|node_modules)$/, // RegExp to ignore subdirectories; default value shown
    map: function map(r) {
      // console.log(r.filepath);
      var currentPath = _path2.default.parse(r.filepath).dir;
      if (r.exports.export_by_imaex && r.exports.export_by_imaex()) {
        //ignore 带有 export_by_imaex 的文件夹下的所有文件
        if (currentPath !== callerPath) {
          //排除caller自己的路径,这个尽管带有"export_by_imaex"标签,但不能被忽略
          ignorePath[currentPath] = true;
        }
        return;
      }
      Object.keys(r.exports).forEach(function (key) {
        if (key == "default") {
          var newBase = void 0;
          if (r.base == "index") {
            var f = _path2.default.parse(r.filepath);
            newBase = _path2.default.parse(f.dir).base;
          } else {
            newBase = r.base;
          }
          preExports[newBase] = {
            exports: r.exports.default,
            path: currentPath
          };
        } else {
          preExports[key] = { exports: r.exports[key], path: currentPath };
        }
      });
    }
  };

  Object.assign(defaultConfig, customConfig);

  (0, _requireDirAll2.default)(callerPath, defaultConfig);

  Object.keys(preExports).forEach(function (key) {
    if (!ignorePath[preExports[key].path]) {
      makingExports[key] = preExports[key].exports;
    }
  });

  if (inputExports) {
    Object.assign(inputExports, makingExports);
  }
  return makingExports;
};

exports.default = imaex;


module.exports = imaex;