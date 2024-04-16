export const httpConstants = {
  400: {
    nullValues: {
      statusMessage: "Please fill in the required fields",
    },
    invalidEmail: {
      statusMessage: "Please enter a valid email address",
    },
    invalidPassword: {
      statusMessage:
        "Password must be at least 8 characters long with at least 1 digit, a special character, an uppercase letter, and a lowercase letter",
    },
    mismatchingPasswords: {
      statusMessage: "Passwords entered do not match",
    },
    existingUser: {
      statusMessage: "User already exists. Kindly login",
    },
    userUnidentified: {
      statusMessage: "User not found. Kindly signup",
    },
    loginError: {
      statusMessage: "Invalid credentials",
    },
    otpError: {
      statusMessage: "Invalid or expired OTP"
    }
  },
  401: {
    unauthorizedAccess: {
      statusMessage: "Unauthorized access",
    },
  },
  200: {
    signupSuccessful: {
      statusMessage: "Signup successful!",
    },
    loginSuccessful: {
      statusMessage: "Login successful!",
    },
    resetEmailSent: {
      statusMessage:
        "Check your email for instructions on resetting your password",
    },
    passwordReset: {
      statusMessage: "Password reset successful"
    }
  },
  500: {
    statusMessage: "Internal server error",
    sendingResetEmail: {
      statusMessage: "Error sending email",
    },
  },
};
