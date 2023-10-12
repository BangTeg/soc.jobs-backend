const jwt = require('jsonwebtoken');

const handleInvalidToken = (res) => {
  return res.status(401).json({ message: "Access Denied - Invalid Token" });
}

module.exports = {
  verifiedToken : async (req, res, next) => {
    // Check if the request contains an Authorization header
    const token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
      return handleInvalidToken(res);
      // return res
      //   .status(401)
      //   .json({ message: "Access Denied - Missing or Invalid Token" });
    }

    // Extract the token value without 'Bearer ' prefix
    const tokenValue = token.slice(7);

    try {
      const verified = jwt.verify(tokenValue, process.env.JWT_SECRET);
      // console.log("Decoded Token:", verified); // Line for debugging
      // const user = await User.findByPk(verified.id);
      req.user = verified;

      // Add this line to log the token payload
      console.log("Token Payload:", verified);
      // console.log("Token Payload:", new Date().getTime());

      next();
    } catch (err) {
      console.error(err);
      return handleInvalidToken(res);
    }
  },  
  adminToken : async (req, res, next) => {
      if (req.user.role !== "Admin")
        return res.status(403).json({ status:'forbidden',message: "Access Denied - You don't have permission" });
        // throw `user ${verified.id} role is ${verified.role}, not admin`;
      next();
  }
};

