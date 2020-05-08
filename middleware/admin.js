const config = require("config");

module.exports = function (req, res, next) {
  if (!config.get("requiresAuth")) return next();

  if (!req.user.isAdmin)
    return res.status(403).send("Access Denied (forbidden).");
  next();
};
// 401 - unauthorized (i,e no valid token provided, so access to anything because no parmission)

// 403 - forbidden (i,e token is valid but not have the permission to access a particular thing)
