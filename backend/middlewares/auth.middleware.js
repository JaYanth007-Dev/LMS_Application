const isLoggedIn = function (req, res, next) {
    const { token } = req.cookies;
    if (!token) {
        return next(new AppError("Unauthenticated,Please login ",401));
    }

    const tokenDetails = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenDetails) {
        return next(new AppError("Unauthenticated,Please login ",401));
    }

    res.user = tokenDetails;
    next();
}

module.exports = {
    isLoggedIn
}