class AppError extends Error {
  constructor(name, httpCode, description) {
    super(description);

    this.name = name;
    this.httpCode = httpCode;
    Error.captureStackTrace(this);
  }
}

export default AppError;