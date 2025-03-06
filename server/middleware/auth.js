const jwt = require('jsonwebtoken');

//middleware filter to check valid JWT token
function authMiddleware(req, res, next) {
  //get token
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: "No token provided." });
  //parse token
  const token = authHeader.split(' ')[1];
  try {
    //check token from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //decodes secret
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
}

module.exports = authMiddleware;