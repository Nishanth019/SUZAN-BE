const bcrypt = require("bcryptjs");

class Hasher {
  getSalt = (SALT_WORK_FACTOR) => {
    return bcrypt.genSaltSync(SALT_WORK_FACTOR);
  };
  hash = (password, SALT) => {
    return bcrypt.hashSync(password, SALT);
  };
  compare = (newPass, currentPass) => {
    return bcrypt.compare(newPass, currentPass);
  };
}

module.exports = new Hasher();
