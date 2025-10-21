module.exports = {
  BAD_REQUEST: 400, // invalid data or invalid ObjectId
  UNAUTHORIZED: 401, // auth required / bad credentials / bad token
  FORBIDDEN: 403, // not the resource owner
  NOT_FOUND: 404, // resource not found / non-existent address
  CONFLICT: 409, // duplicate key (e.g., email)
  INTERNAL_SERVER_ERROR: 500, // default server error
  INTERNAL_SERVER_MESSAGE: "An error has occurred on the server",
};
