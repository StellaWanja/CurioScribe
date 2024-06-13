export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_CREATED = 201;
export const HTTP_STATUS_NO_CONTENT = 204;
export const HTTP_STATUS_BAD_REQUEST = 400;
export const HTTP_STATUS_UNAUTHORIZED_ACCESS = 401;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_RESOURCE_EXISTS = 409;
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

export const HTTP_STATUS_MESSAGES: { [key: number]: string } = {
  [HTTP_STATUS_OK]: "OK",
  [HTTP_STATUS_CREATED]: "Created Successfully",
  [HTTP_STATUS_NO_CONTENT]: "No content",
  [HTTP_STATUS_BAD_REQUEST]: "Bad Request",
  [HTTP_STATUS_UNAUTHORIZED_ACCESS]: "Unauthorized access",
  [HTTP_STATUS_NOT_FOUND]: "Not Found",
  [HTTP_STATUS_RESOURCE_EXISTS]: "Resource exists",
  [HTTP_STATUS_INTERNAL_SERVER_ERROR]: "Internal Server Error",
};
