const jsonwebtoken = require("jsonwebtoken");

module.exports.sendToken = (user) => {

  const token = jsonwebtoken.sign(
    {
      email: user.email,
      id: user._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
      return token;
};
