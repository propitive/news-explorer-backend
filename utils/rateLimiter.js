const rateLimit = require("express-rate-limit");

module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // each IP can make 100 requests per 15 minutes
});
