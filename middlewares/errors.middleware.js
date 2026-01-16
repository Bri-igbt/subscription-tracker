const errorMiddleware = (err, req, res, next) => {
    try {
        let error = err;
        let statusCode = err.statusCode || 500;

        console.error(err);

        // Mongoose invalid ObjectId
        if (err.name === "CastError") {
            error = new Error("Resource not found");
            statusCode = 404;
        }

        // Mongoose duplicate key error
        if (err.code === 11000) {
            error = new Error("Duplicate value entered");
            statusCode = 400;
        }

        // Mongoose validation error
        if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
            error = new Error(message);
            statusCode = 400;
        }

        res.status(statusCode).json({
            success: false,
            error: error.message || "Server Error",
        });

    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;
