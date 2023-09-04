const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['Authorization'];
    if (!token) {
        res.status(200).send({ success: false, msg: 'A token is required for authentication' });
    }   
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;

    } catch (error) {
        res.send(400).send('Invalid token'); 
    }
    return next();
}

module.exports = verifyToken;