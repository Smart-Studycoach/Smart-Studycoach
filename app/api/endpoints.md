# API Endpoints

## Authentication

### POST `/api/auth/login`

Login user with credentials.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`

```json
{
  "user": {
    "_id": "string",
    "email": "string",
    "name": "string",
    "studentProfile": "string",
    "favoriteModules": ["string"],
    "chosenModules": ["string"],
    "createdAt": "string",
    "updatedAt": "string"
  },
  "token": "string"
}
```

**Error Response:** `401 Unauthorized`

```json
{
  "error": "Invalid email or password"
}
```

### POST `/api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "string",
  "password": "string",
  "name": "string",
  "studentProfile": "string"
}
```

**Password Requirements:**

- Minimum 12 characters
- At least one uppercase letter
- At least one number
- At least one special character (!@#$%^&\*(),.?":{}|<>)

**Response:** `201 Created`

```json
{
  "user": {
    "_id": "string",
    "email": "string",
    "name": "string",
    "studentProfile": "string",
    "favoriteModules": ["string"],
    "chosenModules": ["string"],
    "createdAt": "string",
    "updatedAt": "string"
  },
  "token": "string"
}
```

Note: On successful login/register the server also sets an HttpOnly cookie named `token` on the response. Clients may either use the `Authorization: Bearer {token}` header or let the browser send the HttpOnly `token` cookie automatically on subsequent requests.

**Error Response:** `409 Conflict`

```json
{
  "error": "User with this email already exists"
}
```

### GET `/api/auth`

Get current user account details (requires authentication).

**Headers:**

Either supply the header or rely on the HttpOnly cookie set at login/register:

```
Authorization: Bearer {token}
```

Or provide the `token` cookie (HttpOnly) which the server will also accept.

**Response:** `200 OK`

```json
{
  "user": {
    "_id": "string",
    "email": "string",
    "name": "string",
    "studentProfile": "string",
    "favoriteModules": ["string"],
    "chosenModules": ["string"],
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Error Response:** `401 Unauthorized`

```json
{
  "error": "No token provided"
}
```

### PATCH `/api/auth`

Update current user details (name and/or email). Requires authentication.

**Headers:**

Either supply the header or rely on the HttpOnly cookie set at login/register:

```
Authorization: Bearer {token}
```

Or provide the `token` cookie (HttpOnly) which the server will also accept.

**Request Body:**

At least one of the fields should be provided.

```json
{
  "name": "string (optional)",
  "email": "string (optional)"
}
```

**Response:** `200 OK`

```json
{
  "user": {
    "_id": "string",
    "email": "string",
    "name": "string",
    "studentProfile": "string",
    "favoriteModules": ["string"],
    "chosenModules": ["string"],
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Error Response:** `401 Unauthorized`

```json
{
  "error": "No token provided"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Failed to update user"
}
```

### DELETE `/api/auth`

Delete current user account (requires authentication).

**Headers:**

Either supply the header or rely on the HttpOnly cookie set at login/register:

```
Authorization: Bearer {token}
```

Or provide the `token` cookie (HttpOnly) which the server will also accept.

**Response:** `200 OK`

```json
{
  "message": "User deleted successfully"
}
```

Note: On successful account deletion the server clears the `token` cookie.

### PATCH `/api/auth/password`

Update user password (requires authentication and old password verification).

**Headers:**

Either supply the header or rely on the HttpOnly cookie set at login/register:

```
Authorization: Bearer {token}
```

Or provide the `token` cookie (HttpOnly) which the server will also accept.

**Request Body:**

```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

**Password Requirements:**

- Minimum 6 characters
- Must provide correct old password for verification

**Response:** `200 OK`

```json
{
  "message": "Password updated successfully"
}
```

**Error Response:** `400 Bad Request`

```json
{
  "error": "Both old and new passwords are required"
}
```

```json
{
  "error": "New password must be at least 6 characters"
}
```

**Error Response:** `401 Unauthorized`

```json
{
  "error": "No token provided"
}
```

```json
{
  "error": "Current password is incorrect"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Failed to update password"
}
```

## Modules

### GET `/api/modules`

Retrieve all study modules.

**Response:** `200 OK`

```json
{
  "modules": [
    {
      "_id": "string",
      "id": "number",
      "name": "string",
      "shortdescription": ["string"],
      "description": "string",
      "studycredit": "number",
      "location": ["string"],
      "level": "string",
      "learningoutcomes": "string",
      "estimated_difficulty": "number",
      "available_spots": "number",
      "start_date": "string"
    }
  ]
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Failed to fetch modules"
}
```

### GET `/api/modules/[id]`

Retrieve one study module.

**Response:** `200 OK`

```json
{
  "modules": [
    {
      "_id": "string",
      "id": "number",
      "name": "string",
      "shortdescription": ["string"],
      "description": "string",
      "studycredit": "number",
      "location": ["string"],
      "level": "string",
      "learningoutcomes": "string",
      "estimated_difficulty": "number",
      "available_spots": "number",
      "start_date": "string"
    }
  ]
}
```

**Error Response:** `404 Not found`

```json
{
  "error": "Module not found"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Failed to fetch module"
}
```

### POST `/api/modules/[id]`

**Request Body:**

```json
{
  "chosen": true
}
```

**Response:** `200 OK`

```json
{
  "message": "Module choice updated successfully",
  "moduleId": "number",
  "chosen": true
}
```

**Error Response:** `400 Bad Request`

```json
{
  "error": "Invalid request body"
}
```

**Authentication:** This endpoint requires authentication. Provide either `Authorization: Bearer {token}` or rely on the HttpOnly `token` cookie set during login/register. Requests without a valid token will receive `401 Unauthorized`.

**Error Response:** `401 Unauthorized`

```json
{
  "error": "No token provided"
}
```

**Error Response:** `404 Not Found`

```json
{
  "error": "Module not found"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Failed to update module choice"
}
```
