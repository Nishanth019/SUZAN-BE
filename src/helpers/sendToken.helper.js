const jsonwebtoken = require("jsonwebtoken");

module.exports = (user) => {

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
  res
    .cookie("token", token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      secure: true, // set to true if your using https`
      httpOnly: true,
      sameSite: "none",
    })
};
