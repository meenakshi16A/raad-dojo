const createTokenUser = (user) => {
  console.log(user)
  return { name: user.user_name, userId: user._id};
};

module.exports = createTokenUser;
