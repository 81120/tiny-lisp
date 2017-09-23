const repl = require("repl")
const tinyLambda = require('./tiny.js').tinyLambda

repl.start({
  prompt: ">>>> ",
  eval: function(cmd, context, filename, callback) {
    if (cmd !== "(\n)") {
      cmd = cmd.trim();
      console.log(cmd)
      var ret = tinyLambda(cmd);
      callback(null, ret);
    } else {
      callback(null);
    }
  }
});
