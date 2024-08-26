export const error404Handler = (req, res, next) => {
  const error = new Error("Invalid Route");
  res.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  if (err) {
    const statusCode = res.statusCode || 500;
    const message = err.message || "Oops! Something went wrong";
    res.status(statusCode).json({ message });
    return;
  }
};
