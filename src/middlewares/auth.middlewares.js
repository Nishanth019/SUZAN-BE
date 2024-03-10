const jwt = require("jsonwebtoken")
const {JWT_SECRET} = process.env;


// module.exports.Auth = async (req,res,next) => {
//     const token = req.headers['authorization'].split(" ")[1];
//     const decodedData = jwt.verify(token,JWT_SECRET);
//     req.user = decodedData

//     console.info("<------------Authentication--------->")
//     console.info({token,decodedData})
//     console.info("<----------------End---------------->")

//     next()
// }

module.exports.Auth = async (req, res, next) => {
    try {
      // Extract the token from the cookie
      console.log(1,req.cookies);
      const token = req.cookies.token;
      console.log(1,token);
      if (!token) {
        // throw new Error("Token not found in cookie");
        res.status(401).send({
            success: false,
            message: "Unauthorized Access",
            error: error.message,
      });
      }
  
      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Attach the decoded user to the request object
      req.user = decoded;
      console.log(req.user);
      // Call next middleware
      next();
    } catch (error) {
      console.error("Error during JWT verification:", error);
      res.status(401).send({
        success: false,
        message: "Unauthorized Access",
        error: error.message,
  });
  }
  };