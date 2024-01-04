const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log(req.headers);
    const token = req.header('Authorization');//['x-access-token']
    console.log(token);
    if (!token) return res.status(401).json({ error: 'Access denied ! No token provided.' }); // Unauthorized
    try {
        const { ACCESS_SECRET_TOKEN } = process.env;
        const decoded = jwt.verify(token, ACCESS_SECRET_TOKEN);
        console.log(decoded);
        req.userId = decoded.userId;
        console.log(req.userId);
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;