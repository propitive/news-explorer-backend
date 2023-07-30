const handleOnFailError = () => {
  const error = new Error("No item found");
  error.statusCode = 404;
  throw error;
};

module.exports = {
  handleOnFailError,
};
