export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_BAD_REQUEST = 400;
export const HTTP_STATUS_UNAUTHORIZED_ACCESS = 401;
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

export const HTTP_STATUS_MESSAGES: { [key: number]: string } = {
  [HTTP_STATUS_OK]: "OK",
  [HTTP_STATUS_BAD_REQUEST]: "Bad Request",
  [HTTP_STATUS_UNAUTHORIZED_ACCESS]: "Unauthorized access",
  [HTTP_STATUS_INTERNAL_SERVER_ERROR]: "Internal Server Error",
};
