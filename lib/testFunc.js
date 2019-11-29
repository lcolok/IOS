const chalk = require("chalk");
const path = require("path");
const callerCallsite = require("caller-callsite");

module.exports = {
  default: function() {
    const curentPath = path.dirname(callerCallsite().getFileName());
    console.log(
      `${chalk.bgGreen.black(` 顺利读取到 `)}${chalk.bgYellow.black(
        ` ${path.parse(curentPath).base} `
      )}`
    );
  }
};
