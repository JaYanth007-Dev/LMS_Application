const errorMiddleware = (error, req, res, next) => {
    req.statusCode = req.statusCode || 500;
    req.message=req.message || "Something went wrong"
    return res.status(req.statusCode).json({
        message: req.message,
        success: true,
        stack:error.stack
        });

}

module.exports = errorMiddleware;