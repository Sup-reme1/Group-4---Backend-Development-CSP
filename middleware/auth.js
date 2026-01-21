const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    const authHeader = req.header('Authorization');
  
    // Check if the Authorization header is missing
    if (!authHeader) {
      return res.status(403).json({ error: 'Authorization header is missing' });
    }

    // Make sure the token starts with "Bearer "
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;
    
    const authSplit = authHeader.split(' ')[1];
    // const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(authSplit, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = { isAuth };