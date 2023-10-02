const jwt = require('jsonwebtoken');

const verifiedToken = (req, res, next) => {
  // Check if the request contains an Authorization header
  const token = req.header('Authorization');
  
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied - Missing or Invalid Token' });
  }

  // Extract the token value without 'Bearer ' prefix
  const tokenValue = token.slice(7);

  try {
    const verified = jwt.verify(tokenValue, process.env.JWT_SECRET);
    console.log('Decoded Token:', verified); // Line for debugging

    // Include the user's role in the req.user object
    req.user = {
      userId: verified.userId, // Assuming userId is part of the token payload
      role: verified.role,     // Assuming role is part of the token payload
    };

    // Add this line to log the token payload
    console.log('Token Payload:', verified);
    
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Access Denied - Invalid Token' });
  }
};

module.exports = verifiedToken;
