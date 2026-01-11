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

Sets an HttpOnly cookie named `token` on the response.

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

**Error Response:** `400 Bad Request`

```json
{
  "error": "Email and password are required"
}
```

**Error Response:** `401 Unauthorized`

```json
{
  "error": "Invalid email or password"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Login failed"
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

**Email Requirements:**

- Must be a valid email format

**Response:** `201 Created`

Sets an HttpOnly cookie named `token` on the response.

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

**Error Response:** `400 Bad Request`

```json
{
  "error": "Email, password, and name are required"
}
```

```json
{
  "error": "Invalid email format"
}
```

```json
{
  "error": "Password must be at least 12 characters long"
}
```

```json
{
  "error": "Password must contain at least one uppercase letter"
}
```

```json
{
  "error": "Password must contain at least one number"
}
```

```json
{
  "error": "Password must contain at least one special character"
}
```

**Error Response:** `409 Conflict`

```json
{
  "error": "User with this email already exists"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Registration failed"
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

```json
{
  "error": "Invalid or expired token"
}
```

**Error Response:** `404 Not Found`

```json
{
  "error": "User not found"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Failed to get user"
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

**Error Response:** `400 Bad Request`

```json
{
  "error": "No fields provided for update"
}
```

```json
{
  "error": "Invalid email format"
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
  "error": "Invalid or expired token"
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

**Error Response:** `401 Unauthorized`

```json
{
  "error": "No token provided"
}
```

```json
{
  "error": "Invalid or expired token"
}
```

**Error Response:** `404 Not Found`

```json
{
  "error": "User not found"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Failed to delete user"
}
```

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

**Password Requirements for New Password:**

- Minimum 12 characters
- At least one uppercase letter
- At least one number
- At least one special character (!@#$%^&\*(),.?":{}|<>)

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
  "error": "Password must be at least 12 characters long"
}
```

```json
{
  "error": "Password must contain at least one uppercase letter"
}
```

```json
{
  "error": "Password must contain at least one number"
}
```

```json
{
  "error": "Password must contain at least one special character"
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
  "error": "Invalid or expired token"
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

Retrieve all study modules with optional filtering.

**Query Parameters (all optional):**

```
?name=string
?level=string
?studyCredit=number
?location=string
?difficulty=number
```

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

Retrieve one study module by ID. Returns additional fields if authenticated (isEnrolled, isFavorited).

**Response:** `200 OK` (Unauthenticated)

```json
{
  "module": {
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
}
```

**Response:** `200 OK` (Authenticated)

```json
{
  "module": {
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
  },
  "isEnrolled": "boolean",
  "isFavorited": "boolean"
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
  "error": "Failed to fetch module"
}
```

## User Endpoints

### GET `/api/users/me/account`

Get current user's profile information including chosen modules (requires authentication).

**Headers:**

```
Authorization: Bearer {token}
```

Or provide the `token` cookie (HttpOnly).

**Response:** `200 OK`

```json
{
  "name": "string",
  "student_profile": "string",
  "chosen_modules": [
    {
      "module_id": "number",
      "name": "string"
    }
  ]
}
```

**Error Response:** `401 Unauthorized`

```json
{
  "error": "Unauthorized"
}
```

**Error Response:** `404 Not Found`

```json
{
  "error": "Not found"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Internal server error"
}
```

### POST `/api/users/me/enrollments`

Enroll the current user in a module (requires authentication).

**Headers:**

```
Authorization: Bearer {token}
```

Or provide the `token` cookie (HttpOnly).

**Request Body:**

```json
{
  "module_id": "number"
}
```

**Response:** `200 OK`

```json
{
  "message": "successfully enrolled",
  "moduleId": "number"
}
```

**Error Response:** `400 Bad Request`

```json
{
  "error": "Invalid request body"
}
```

**Error Response:** `401 Unauthorized`

```json
{
  "error": "Unauthorized"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Failed to enroll"
}
```

### DELETE `/api/users/me/enrollments/[module_id]`

Unenroll the current user from a module (requires authentication).

**Headers:**

```
Authorization: Bearer {token}
```

Or provide the `token` cookie (HttpOnly).

**Response:** `200 OK`

```json
{
  "succes": true
}
```

**Error Response:** `400 Bad Request`

```json
{
  "error": "Invalid module id: {module_id}"
}
```

**Error Response:** `401 Unauthorized`

```json
{
  "error": "Unauthorized"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Failed to unenroll"
}
```

### GET `/api/users/me/favorites/[module_id]`

Check if a module is favorited by the current user.

**Headers:**

```
Authorization: Bearer {token}
```

Or provide the `token` cookie (HttpOnly). If not authenticated, returns `favorite: false`.

**Response:** `200 OK` (Unauthenticated)

```json
{
  "favorite": false
}
```

**Response:** `200 OK` (Authenticated)

```json
{
  "favorite": "boolean"
}
```

**Error Response:** `400 Bad Request`

```json
{
  "error": "Invalid module id: {module_id}"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Failed to check favorite"
}
```

### PUT `/api/users/me/favorites/[module_id]`

Add a module to the current user's favorites (requires authentication).

**Headers:**

```
Authorization: Bearer {token}
```

Or provide the `token` cookie (HttpOnly).

**Response:** `200 OK`

```json
{
  "success": true
}
```

**Error Response:** `400 Bad Request`

```json
{
  "error": "Invalid module id"
}
```

**Error Response:** `401 Unauthorized`

```json
{
  "error": "Unauthorized"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Failed to update favorite"
}
```

### DELETE `/api/users/me/favorites/[module_id]`

Remove a module from the current user's favorites (requires authentication).

**Headers:**

```
Authorization: Bearer {token}
```

Or provide the `token` cookie (HttpOnly).

**Response:** `200 OK`

```json
{
  "succes": true
}
```

**Error Response:** `400 Bad Request`

```json
{
  "error": "Invalid module id"
}
```

**Error Response:** `401 Unauthorized`

```json
{
  "error": "Unauthorized"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Failed to update favorite"
}
```
