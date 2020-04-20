const jwt = require('jsonwebtoken');
const jwt_key = "secret";

module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.body.token, jwt_key);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication failed!'
        });
    }
    
    
};