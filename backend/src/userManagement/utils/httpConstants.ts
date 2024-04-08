export const httpConstants = {
  "Bad Request": {
    nullValues: {
      statusCode: 400,
      statusMessage: "Please fill in the required fields",
    },
    invalidEmail: {
      statusCode: 400,
      statusMessage: "Please enter a valid email address",
    },
    invalidPassword: {
      statusCode: 400,
      statusMessage:
        "Password must be at least 8 characters long with at least 1 digit, a special character, an uppercase letter, and a lowercase letter",
    },
    mismatchingPasswords: {
      statusCode: 400,
      statusMessage: "Passwords entered do not match",
    },
  },
  "OK": {
    signupSuccessful: {
      statusCode: 200,
      statusMessage: "Signup successful!",
    },
  },
  "Server error": {
    statusCode: 500,
    statusMessage: "Internal server error"
  }
};
