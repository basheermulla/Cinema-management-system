const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // To retrieve the token without `Bearer` at the beginning of the Authorization header
    const token = req.header('Authorization').split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied ! No token provided.' }); // Unauthorized
    }

    try {
        const { ACCESS_SECRET_TOKEN } = process.env;
        const decode = jwt.verify(token, ACCESS_SECRET_TOKEN);
        const { exp } = decode;
        const current = Date.now();
        // console.log(new Date(exp * 1000).toLocaleTimeString('he-IL',
        // { timeZone: 'Asia/Jerusalem' }));
        // console.log(new Date(current).toLocaleTimeString('he-IL',
        // { timeZone: 'Asia/Jerusalem' }));
        if (current >= exp * 1000) {
            return res.status(401).json({ message: 'Token has been expired' })
        }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = verifyToken;