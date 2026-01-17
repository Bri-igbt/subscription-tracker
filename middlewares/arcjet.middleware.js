import  aj  from "../configs/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req,  { requested: 5 });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({
                success: false,
                error: "Too many requests",
                });
            }

            if (decision.reason.isBot()) {
                return res.status(403).json({
                success: false,
                error: "Bots are not allowed",
                });
            }

            return res.status(403).json({
                success: false,
                error: "Forbidden",
            });
        }

    next();

    } catch (error) {
        res.status(500).json(` Arcjet Middleware Error: ${error.message}`);
        next(error);
    }
};

export default arcjetMiddleware;