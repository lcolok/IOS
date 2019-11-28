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

require("babel-polyfill");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var imaex = exports.imaex = function imaex(inputExports, customConfig) {
  var makingExports = {};
  var defaultConfig = {
    // options
    recursive: true, // recursively go through subdirectories; default value shown
    indexAsParent: false, // add content of index.js/index.json files to parent object, not to parent.index
    includeFiles: /^.*\.(js)$/, // RegExp to select files; default value shown
    excludeDirs: /^(\.git|\.svn|node_modules)$/, // RegExp to ignore subdirectories; default value shown
    map: function map(r) {
      Object.keys(r.exports).forEach(function (key) {
        if (key == "default") {
          var newBase = void 0;
          if (r.base == "index") {
            var f = _path2.default.parse(r.filepath);
            newBase = _path2.default.parse(f.dir).base;
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
  (0, _requireDirAll2.default)(_path2.default.dirname((0, _callerCallsite2.default)().getFileName()), defaultConfig);
  Object.assign(inputExports, makingExports);
};

exports.default = imaex;


module.exports = { imaex: imaex };