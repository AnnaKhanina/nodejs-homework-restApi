class RegistrationConflictError extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}

class LoginAuthError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

module.exports = {
  RegistrationConflictError,
  LoginAuthError,
};
