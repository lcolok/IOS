const chalk = require("chalk");
const path = require("path");
console.log(
  `${chalk.bgGreen.black(` 顺利读取到 `)}${chalk.bgYellow.black(
    ` ${path.parse(__dirname).base}/${path.parse(__filename).base} `
  )}`
);
