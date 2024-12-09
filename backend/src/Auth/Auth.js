const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Middleware to authenticate JWT token and attach user data to the request.
 */
const authenticateToken = async (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If no token is provided, return 401 error
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token with the secret key
    const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);

    // If token is invalid, return 401 error
    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach the user data to the request object
    req.user = decodedToken;

    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    // Return 500 error if token verification fails
    return res
      .status(500)
      .json({ message: "Server error while verifying token" });
  }
};

module.exports = authenticateToken;
