const jsonwebtoken = require("jsonwebtoken");

module.exports.sendToken = (user) => {
  const expiresIn = 7 * 24 * 60 * 60;

  const token = jsonwebtoken.sign(
    {
      email: user.email,
      id: user._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: expiresIn,
    }
  );
      return token;
};
