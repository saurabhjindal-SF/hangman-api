export const enum StatusCode {
  // sonarignore:start
  OK = 200,
  CREATED,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORISED,
  FORBIDDEN = 403,
  NOT_FOUND,
  UNPROCESSED_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  // sonarignore:end
}

export const ErrorCodes = {
  [StatusCode.UNAUTHORISED]: {
    description: 'Invalid Credentials.',
  },
  [StatusCode.BAD_REQUEST]: {
    description: 'The syntax of the request entity is incorrect.',
  },
  [StatusCode.UNPROCESSED_ENTITY]: {
    description: 'The syntax of the request entity is incorrect',
  },
  [StatusCode.NOT_FOUND]: {
    description: 'The entity requested does not exist.',
  },
};
