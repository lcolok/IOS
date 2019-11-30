const ra = require("./requireAll");

for (let i in ra) {
  console.log(i);
  ra[i]();
}
