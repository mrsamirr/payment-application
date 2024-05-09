const dotenv = require('dotenv');
require('dotenv').config()
const jwt = require("jsonwebtoken");
// Middleware for handling auth
const authMiddleware = (req, res, next) => {
   
    // token as input
    const token = req.headers.authorization;
    
    if(!token || !token.startsWith('Bearer ')){
        return res.status(403).json({});
    }

    const jwtToken = token.split(" ")[1];

    // Verifies that the token is valid

   try {
    // puts the `userId` in the request object if the token checks out.
    const decoded = jwt.verify(jwtToken, JWT_SECRET);
    if(decoded.userId) {
        req.userId = decoded.userId;
         next();
    }
    else {
        return res.status(403).json({})
    }

    //   If not, return a 403 status back to the user
    } catch(err) {
        return res.status(403).json({})
    }

};


 module.exports = {
    authMiddleware
}