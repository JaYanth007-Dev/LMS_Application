const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const isLoggedIn = function (req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return next(new AppError("Unauthenticated,Please login ", 401));
  }

  const tokenDetails = jwt.verify(token, process.env.JWT_SECRET);
  if (!tokenDetails) {
    return next(new AppError("Unauthenticated,Please login ", 401));
  }
  res.user = tokenDetails;
  next();
};


const authorizedRoles = (...roles) => (req, res, next) => {
    const role = res?.user?.role;
 
    if (!roles.includes(res.user.role)){
      return next(
        new AppError("You do not have permission to access this route", 403)
      );
    }
 
    next();

}


const authorizedSubscriber = (req, res, next) => {
  console.log("authorizedSubscriber",res.user)
    const subscriptionStatus = res.user.subscription.status;
    const currentRole = res.user.role;
    if (currentRole != 'ADMIN' && subscriptionStatus !== 'active')
        return next(new AppError("Please subscribe to access this route", 403));
    next()
}
module.exports = {
    isLoggedIn,
    authorizedRoles,
    authorizedSubscriber
};
