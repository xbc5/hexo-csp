const util = require("util");

function format(obj) {
  // this is more for testing. It makes it easier to match
  // the message, since there is some fancy styling applied.
  // It makes it consistent.
  return util.inspect(obj, false, null, true);
}

function middleware(log = console.error) {
  return (req, res) => {
    log(format(req.body));
    res.end();
  };
}

module.exports = { middleware, format };
