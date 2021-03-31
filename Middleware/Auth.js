const jwt = require('jsonwebtoken');
module.exports=(req,res,next)=>{
    let token = req.header('auth-token');

    if (!token)
  
  return res.status(401).json({ msg: 'No token, authorizaton denied' });

try {
  // Verify token
  const decoded = jwt.verify(token,  config["jwtSecret"]);
  // Add user from payload
  
  req.user = decoded;
  next();
} catch (e) {
  res.status(400).json({ msg: 'Token is not valid' });
}
}