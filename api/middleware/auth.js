const jwt = require('jsonwebtoken');

// Load config with fallback
let config = {};
try {
    config = require('../../config.json');
} catch (e) {
    // config.json not found, using env vars
}

// Use environment variable with fallback to config
const JWT_SECRET = process.env.JWT_SECRET || config.token_secret;

if (!JWT_SECRET) {
    console.error('WARNING: JWT_SECRET is not set. Please set it in .env file or config.json');
}

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                status: 'nok',
                message: 'No authorization header provided'
            });
        }

        // Check for Bearer token format
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                status: 'nok',
                message: 'Invalid authorization header format. Use: Bearer <token>'
            });
        }

        const token = parts[1];

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach user info to request object
        req.userId = decoded.userId;

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'nok',
                message: 'Token has expired'
            });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'nok',
                message: 'Invalid token'
            });
        }
        return res.status(500).json({
            status: 'nok',
            message: 'Authentication error'
        });
    }
};

module.exports = authMiddleware;
